import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { isHoneypotClear, parseSessionCookie, sessionCookie, verifyOrigin } from './security.mjs';
import { LeadFlowError } from './workflow.mjs';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function sendJson(response, status, payload, headers = {}) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
    ...headers,
  });
  response.end(body);
}

function sendHtml(response, status, body, headers = {}) {
  response.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
    ...headers,
  });
  response.end(body);
}

async function readBody(request, limit) {
  const chunks = [];
  let total = 0;
  let exceeded = false;
  for await (const chunk of request) {
    total += chunk.length;
    if (total > limit) {
      exceeded = true;
      continue;
    }
    chunks.push(chunk);
  }
  if (exceeded) throw new LeadFlowError('body_too_large', 413, 'Request is too large');
  return Buffer.concat(chunks).toString('utf8');
}

async function parseBody(request, limit) {
  const raw = await readBody(request, limit);
  const contentType = request.headers['content-type']?.split(';')[0]?.trim();
  if (contentType === 'application/json') {
    try {
      return JSON.parse(raw || '{}');
    } catch {
      throw new LeadFlowError('invalid_json', 400, 'Invalid request');
    }
  }
  if (contentType === 'application/x-www-form-urlencoded') {
    const fields = Object.fromEntries(new URLSearchParams(raw));
    return {
      ...fields,
      marketingOptIn: ['true', 'on', '1', 'yes'].includes(fields.marketingOptIn),
      turnstileToken: fields.turnstileToken || fields['cf-turnstile-response'],
    };
  }
  throw new LeadFlowError('unsupported_media_type', 415, 'Unsupported request');
}

function remoteIp(request) {
  const forwarded = request.headers['cf-connecting-ip']
    || request.headers['x-real-ip']
    || request.headers['x-forwarded-for']
    || request.socket.remoteAddress
    || 'unknown';
  return String(forwarded).split(',')[0].trim();
}

function fallbackPage({ config, material, lang = 'pt-BR', error = '' }) {
  const english = lang === 'en';
  const title = english ? 'Get the free resource' : 'Receba o material gratuito';
  const description = english
    ? 'Enter your email and the download will start immediately.'
    : 'Informe seu e-mail e o download começará imediatamente.';
  const button = english ? 'Download the resource' : 'Baixar o material';
  const privacyHref = english ? '/en/privacy/' : '/privacidade/';
  const privacy = english
    ? 'We use your email to deliver this resource. Marketing updates are optional.'
    : 'Usamos seu e-mail para entregar este material. Novidades são opcionais.';
  const label = material.labels[lang] ?? material.labels['pt-BR'];
  const errorHtml = error ? `<div role="alert"><strong>${escapeHtml(error)}</strong></div>` : '';
  return `<!doctype html>
<html lang="${english ? 'en' : 'pt-BR'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
<body><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><h2>${escapeHtml(label)}</h2>${errorHtml}
<form method="post" action="/api/download-leads/register-form">
<label for="email">E-mail</label><input id="email" name="email" type="email" autocomplete="email" required>
<label><input name="marketingOptIn" type="checkbox" value="true"> ${english ? 'I want to receive Produto com IA updates' : 'Quero receber novidades do Produto com IA'}</label>
<div aria-hidden="true" style="position:absolute;left:-10000px"><label>Company<input name="company" tabindex="-1" autocomplete="off"></label></div>
<input type="hidden" name="materialId" value="${escapeHtml(material.id)}"><input type="hidden" name="sourcePath" value="/downloads/${escapeHtml(material.filename)}"><input type="hidden" name="lang" value="${english ? 'en' : 'pt-BR'}"><input type="hidden" name="privacyVersion" value="${escapeHtml(config.privacyVersion)}">
<div class="cf-turnstile" data-sitekey="${escapeHtml(config.turnstileSiteKey)}" data-action="download_lead" data-appearance="interaction-only"></div>
<p>${escapeHtml(privacy)} <a href="${privacyHref}">${english ? 'Privacy policy' : 'Política de privacidade'}</a>.</p>
<button type="submit">${escapeHtml(button)}</button></form></main>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script></body></html>`;
}

function errorPayload(error, requestId) {
  return {
    error: error instanceof LeadFlowError ? error.code : 'internal_error',
    message: error instanceof LeadFlowError ? error.message : 'Service temporarily unavailable',
    requestId,
  };
}

export function createLeadHandler({ config, catalog, workflow, rateLimiter }) {
  return async function leadHandler(request, response) {
    const requestId = randomUUID();
    response.setHeader('x-request-id', requestId);
    const url = new URL(request.url, config.allowedOrigin);
    let parsedBody;

    try {
      if (request.method === 'GET' && url.pathname === '/api/download-leads/config') {
        return sendJson(response, 200, {
          turnstileSiteKey: config.turnstileSiteKey,
          privacyVersion: config.privacyVersion,
        });
      }

      if (request.method === 'GET' && url.pathname === '/api/download-leads/health') {
        await workflow.health();
        return sendJson(response, 200, { status: 'ok' });
      }

      if (request.method === 'GET' && url.pathname.startsWith('/downloads/')) {
        const filename = decodeURIComponent(url.pathname.slice('/downloads/'.length));
        const material = catalog.byFilename.get(filename);
        if (!material) throw new LeadFlowError('material_not_found', 404, 'Material not found');
        return sendHtml(response, 200, fallbackPage({
          config,
          material,
          lang: url.searchParams.get('lang') === 'en' ? 'en' : 'pt-BR',
        }));
      }

      if (request.method === 'GET' && url.pathname.startsWith('/api/download-leads/file/')) {
        const downloadToken = url.pathname.slice('/api/download-leads/file/'.length);
        const { filePath, material } = await workflow.resolveFile({ downloadToken });
        const file = await stat(filePath);
        response.writeHead(200, {
          'content-type': material.contentType,
          'content-length': file.size,
          'content-disposition': `attachment; filename="${material.filename}"`,
          'cache-control': 'private, no-store',
          'x-content-type-options': 'nosniff',
        });
        return createReadStream(filePath).pipe(response);
      }

      const isRegister = request.method === 'POST'
        && ['/api/download-leads/register', '/api/download-leads/register-form'].includes(url.pathname);
      const isAuthorize = request.method === 'POST' && url.pathname === '/api/download-leads/authorize';

      if (isRegister || isAuthorize) {
        if (!verifyOrigin(request.headers.origin, config.allowedOrigin)) {
          throw new LeadFlowError('forbidden_origin', 403, 'Forbidden origin');
        }
        const body = await parseBody(request, config.maxBodyBytes);
        parsedBody = body;
        if (isRegister) {
          if (!isHoneypotClear(body.company)) {
            throw new LeadFlowError('invalid_submission', 400, 'Invalid submission');
          }
          const limit = rateLimiter.check(remoteIp(request));
          if (!limit.allowed) {
            return sendJson(response, 429, errorPayload(
              new LeadFlowError('rate_limited', 429, 'Try again later'),
              requestId,
            ), { 'retry-after': String(limit.retryAfter) });
          }
          const result = await workflow.register({ ...body, remoteIp: remoteIp(request) });
          const cookie = sessionCookie(result.sessionToken, config.sessionDays * 86_400);
          if (url.pathname.endsWith('register-form')) {
            response.writeHead(303, {
              location: result.downloadUrl,
              'set-cookie': cookie,
              'cache-control': 'no-store',
            });
            return response.end();
          }
          return sendJson(response, 201, { downloadUrl: result.downloadUrl }, { 'set-cookie': cookie });
        }

        const result = workflow.authorize({
          ...body,
          sessionToken: parseSessionCookie(request.headers.cookie),
        });
        return sendJson(response, 200, { downloadUrl: result.downloadUrl });
      }

      throw new LeadFlowError('not_found', 404, 'Not found');
    } catch (error) {
      const status = error instanceof LeadFlowError ? error.status : 503;
      if (request.method === 'POST' && url.pathname === '/api/download-leads/register-form') {
        const material = catalog.byId.get(parsedBody?.materialId) || catalog.items[0];
        return sendHtml(response, status, fallbackPage({
          config,
          material,
          lang: parsedBody?.lang === 'en' ? 'en' : 'pt-BR',
          error: error instanceof LeadFlowError ? error.message : 'Serviço temporariamente indisponível',
        }));
      }
      return sendJson(response, status, errorPayload(error, requestId));
    }
  };
}
