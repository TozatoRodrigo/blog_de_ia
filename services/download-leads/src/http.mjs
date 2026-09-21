import { createReadStream } from 'node:fs';
import { isIP } from 'node:net';
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

function sendRedirect(response, location) {
  response.writeHead(301, {
    location,
    'cache-control': 'public, max-age=300',
  });
  response.end();
}

function sendContributionRedirect(response, location) {
  response.writeHead(303, {
    location,
    'cache-control': 'no-store',
  });
  response.end();
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

function normalizedIp(value) {
  const candidate = String(value ?? '').trim();
  return isIP(candidate) ? candidate : '';
}

function ipv4Value(value) {
  const ip = normalizedIp(value);
  if (!ip || ip.includes(':')) return null;
  return ip.split('.').map(Number).reduce((result, octet) => (result * 256) + octet, 0) >>> 0;
}

function ipInCidr(value, cidr) {
  const [network, prefixText] = String(cidr ?? '').split('/');
  const addressValue = ipv4Value(value);
  const networkValue = ipv4Value(network);
  const prefix = Number(prefixText);
  if (addressValue === null || networkValue === null || !Number.isInteger(prefix) || prefix < 1 || prefix > 32) {
    return false;
  }
  const mask = (0xffffffff << (32 - prefix)) >>> 0;
  return ((addressValue & mask) >>> 0) === ((networkValue & mask) >>> 0);
}

export function remoteIp(request, trustedProxyCidr) {
  const socketIp = normalizedIp(request.socket?.remoteAddress);
  const proxyIp = normalizedIp(request.headers['x-real-ip']);
  if (ipInCidr(socketIp, trustedProxyCidr) && proxyIp) return proxyIp;
  return socketIp || 'unknown';
}

function fallbackPage({ config, material, lang = 'pt-BR', error = '' }) {
  const english = lang === 'en';
  const title = material.labels[lang] ?? material.labels[material.language];
  const description = material.description[lang] ?? material.description[material.language];
  const canonical = new URL(`/downloads/${material.filename}`, config.allowedOrigin).toString();
  const relatedUrl = material.relatedUrl[lang] ?? material.relatedUrl[material.language];
  const resourceIntro = english
    ? 'This protected resource complements the related editorial guide with a practical structure for review, planning, or execution.'
    : 'Este material protegido complementa o guia editorial relacionado com uma estrutura prática para revisão, planejamento ou execução.';
  const resourceUse = english
    ? 'Adapt the fields to your context, record the evidence behind each decision, and revisit the document when the product, risk, or operating model changes.'
    : 'Adapte os campos ao seu contexto, registre a evidência por trás de cada decisão e revise o documento quando o produto, o risco ou a operação mudar.';
  const button = english ? 'Download the resource' : 'Baixar o material';
  const privacyHref = english ? '/en/privacy/' : '/privacidade/';
  const privacy = english
    ? 'We use your email to deliver this resource. Marketing updates are optional.'
    : 'Usamos seu e-mail para entregar este material. Novidades são opcionais.';
  const label = material.labels[lang] ?? material.labels['pt-BR'];
  const errorHtml = error ? `<div role="alert"><strong>${escapeHtml(error)}</strong></div>` : '';
  return `<!doctype html>
<html lang="${english ? 'en' : 'pt-BR'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)} — Produto com IA</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="noindex, nofollow, noarchive"><link rel="canonical" href="${escapeHtml(canonical)}"></head>
<body><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><p>${escapeHtml(resourceIntro)}</p><p>${escapeHtml(resourceUse)}</p><p><a href="${escapeHtml(relatedUrl)}">${english ? 'Read the related guide' : 'Leia o guia relacionado'}</a></p><h2>${escapeHtml(label)}</h2>${errorHtml}
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

const CONTRIBUTION_ERROR_MESSAGES = Object.freeze({
  invalid_submission: {
    'pt-BR': 'Confira os campos obrigatórios e tente novamente.',
    en: 'Check the required fields and try again.',
  },
  invalid_email: {
    'pt-BR': 'Digite um e-mail válido.',
    en: 'Enter a valid email.',
  },
  invalid_url: {
    'pt-BR': 'Use apenas links válidos começando com http ou https.',
    en: 'Use valid links beginning with http or https.',
  },
  body_too_large: {
    'pt-BR': 'O texto enviado é grande demais. Reduza o conteúdo e tente novamente.',
    en: 'The submitted text is too large. Shorten it and try again.',
  },
  privacy_version_mismatch: {
    'pt-BR': 'Atualize a página para aceitar a versão atual da política de privacidade.',
    en: 'Reload the page to accept the current privacy policy version.',
  },
  turnstile_failed: {
    'pt-BR': 'Não foi possível validar a verificação. Tente novamente.',
    en: 'The verification could not be completed. Please try again.',
  },
  rate_limited: {
    'pt-BR': 'Aguarde alguns minutos antes de enviar outra contribuição ou fale diretamente com o editor.',
    en: 'Please wait a few minutes before trying again, or contact the editor directly.',
  },
  forbidden_origin: {
    'pt-BR': 'Não foi possível validar a origem deste envio.',
    en: 'The origin of this submission could not be validated.',
  },
  invalid_json: {
    'pt-BR': 'O envio não está em um formato válido.',
    en: 'The submission format is invalid.',
  },
  unsupported_media_type: {
    'pt-BR': 'Este formato de envio não é aceito.',
    en: 'This submission format is not supported.',
  },
  internal_error: {
    'pt-BR': 'Não foi possível receber a contribuição agora. Fale diretamente com o editor.',
    en: 'The contribution could not be received right now. Contact the editor directly.',
  },
});

function contributionLanguage(body) {
  return body?.lang === 'en' || body?.language === 'en' ? 'en' : 'pt-BR';
}

function contributionMessage(error, lang) {
  const code = error instanceof LeadFlowError ? error.code : 'internal_error';
  return CONTRIBUTION_ERROR_MESSAGES[code]?.[lang]
    ?? CONTRIBUTION_ERROR_MESSAGES.internal_error[lang];
}

function contributionErrorPayload(error, lang) {
  const code = error instanceof LeadFlowError ? error.code : 'internal_error';
  const field = ['name', 'email', 'role', 'siteUrl', 'title', 'excerpt', 'content', 'links', 'bio'].includes(error?.field)
    ? error.field
    : null;
  return { error: code, field, message: contributionMessage(error, lang) };
}

function contributionFieldValue(body, field) {
  return typeof body?.[field] === 'string' ? body[field] : '';
}

function contributionFallbackPage({ config, values = {}, lang = 'pt-BR', error = '' }) {
  const english = lang === 'en';
  const pagePath = english ? '/en/contribute/' : '/contribua/';
  const privacyHref = english ? '/en/privacy/' : '/privacidade/';
  const contactHref = english ? '/en/about#contact' : '/sobre#contato';
  const copy = english
    ? {
      title: 'Contribute an idea',
      intro: 'Send an editorial contribution for review. Submissions are reviewed by the editorial team and are not automatically published.',
      name: 'Name',
      email: 'Email',
      role: 'Role or professional context',
      siteUrl: 'Website',
      titleField: 'Contribution title',
      excerpt: 'Short summary',
      content: 'Full contribution',
      links: 'Links to credit',
      bio: 'Short bio',
      submit: 'Send for review',
      privacy: 'We use these details to evaluate the contribution and contact you about it.',
      privacyLink: 'Privacy policy',
      contact: 'Prefer to start with a question? Contact the editor directly.',
      contactLink: 'Contact the editor',
      turnstile: 'This form uses Cloudflare Turnstile for abuse prevention.',
      noScript: 'JavaScript is required to complete Cloudflare Turnstile; without it, this endpoint cannot verify the submission.',
    }
    : {
      title: 'Contribua com uma ideia',
      intro: 'Envie uma contribuição editorial para avaliação. Cada envio é lido pela equipe editorial e não é publicado automaticamente.',
      name: 'Nome',
      email: 'E-mail',
      role: 'Cargo ou contexto profissional',
      siteUrl: 'Site',
      titleField: 'Título da contribuição',
      excerpt: 'Resumo curto',
      content: 'Texto completo da contribuição',
      links: 'Links para creditar',
      bio: 'Bio curta',
      submit: 'Enviar para avaliação',
      privacy: 'Usamos esses dados para avaliar a contribuição e falar com você sobre ela.',
      privacyLink: 'Política de privacidade',
      contact: 'Prefere começar com uma pergunta? Fale diretamente com o editor.',
      contactLink: 'Falar com o editor',
      turnstile: 'Este formulário usa Cloudflare Turnstile para evitar abusos.',
      noScript: 'JavaScript é necessário para concluir o Cloudflare Turnstile; sem ele, este endpoint não pode verificar o envio.',
    };
  const field = (name, label, type = 'text') => `<label for="contribution-${name}">${label}</label><input id="contribution-${name}" name="${name}" type="${type}" value="${escapeHtml(contributionFieldValue(values, name))}"${type === 'email' ? ' autocomplete="email"' : ''}>`;
  const textarea = (name, label) => `<label for="contribution-${name}">${label}</label><textarea id="contribution-${name}" name="${name}">${escapeHtml(contributionFieldValue(values, name))}</textarea>`;
  const errorHtml = error ? `<div role="alert"><strong>${escapeHtml(error)}</strong></div>` : '';
  const hidden = (name, value) => `<input type="hidden" name="${name}" value="${escapeHtml(value)}">`;
  return `<!doctype html>
<html lang="${english ? 'en' : 'pt-BR'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(copy.title)} — Produto com IA</title><meta name="robots" content="noindex, nofollow, noarchive"></head>
<body><main><p><a href="${pagePath}">Produto com IA</a></p><h1>${escapeHtml(copy.title)}</h1><p>${escapeHtml(copy.intro)}</p>${errorHtml}
<noscript><p>${escapeHtml(copy.noScript)} <a data-contact-direct="true" href="mailto:${escapeHtml(config.notificationTo)}">${escapeHtml(copy.contactLink)}</a> · <a href="${contactHref}">${escapeHtml(copy.contactLink)}</a> · <a href="${privacyHref}">${escapeHtml(copy.privacyLink)}</a>.</p></noscript>
<form method="post" action="/api/contributions/submit">
${field('name', copy.name)}${field('email', copy.email, 'email')}${field('role', copy.role)}${field('siteUrl', copy.siteUrl)}${field('title', copy.titleField)}${textarea('excerpt', copy.excerpt)}${textarea('content', copy.content)}${textarea('links', copy.links)}${textarea('bio', copy.bio)}
<label><input name="consent" type="checkbox" value="on" required> ${escapeHtml(english ? 'I confirm that I am the author or have permission to submit this material.' : 'Confirmo que sou autor ou tenho autorização para enviar este material.')}</label>
<div aria-hidden="true" style="position:absolute;left:-10000px"><label for="contribution-company">Company</label><input id="contribution-company" name="company" tabindex="-1" autocomplete="off"></div>
${hidden('lang', english ? 'en' : 'pt-BR')}${hidden('sourcePath', pagePath)}${hidden('privacyVersion', config.contributionPrivacyVersion || config.privacyVersion)}
<div class="cf-turnstile" data-sitekey="${escapeHtml(config.turnstileSiteKey)}" data-action="contribution_submit" data-appearance="interaction-only"></div>
<p>${escapeHtml(copy.privacy)} <a href="${privacyHref}">${escapeHtml(copy.privacyLink)}</a>. ${escapeHtml(copy.turnstile)}</p><p>${escapeHtml(copy.contact)} <a href="${contactHref}">${escapeHtml(copy.contactLink)}</a>.</p>
<button type="submit">${escapeHtml(copy.submit)}</button></form></main><script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script></body></html>`;
}

export function createLeadHandler({ config, catalog, workflow, rateLimiter, contributionWorkflow, contributionRateLimiter }) {
  // The dedicated workflow owns the canonical limiter check; keeping this dependency
  // in the handler composition makes the security boundary explicit without double-counting requests.
  void contributionRateLimiter;
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
          contributionPrivacyVersion: config.contributionPrivacyVersion,
        });
      }

      if (request.method === 'GET' && url.pathname === '/api/download-leads/health') {
        await workflow.health();
        return sendJson(response, 200, { status: 'ok' });
      }

      if (request.method === 'GET' && url.pathname === '/downloads/') {
        return sendRedirect(response, url.searchParams.get('lang') === 'en' ? '/en/guides/' : '/guias/');
      }

      if (request.method === 'GET' && url.pathname.startsWith('/downloads/')) {
        const filename = decodeURIComponent(url.pathname.slice('/downloads/'.length));
        const material = catalog.byFilename.get(filename);
        if (!material) throw new LeadFlowError('material_not_found', 404, 'Material not found');
        if (url.searchParams.has('lang')) return sendRedirect(response, `/downloads/${encodeURIComponent(material.filename)}`);
        const lang = material.language;
        return sendHtml(response, 200, fallbackPage({
          config,
          material,
          lang,
        }), { 'x-robots-tag': 'noindex, nofollow, noarchive' });
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
      const isContribution = request.method === 'POST' && url.pathname === '/api/contributions/submit';

      if (isContribution) {
        if (!verifyOrigin(request.headers.origin, config.allowedOrigin)) {
          throw new LeadFlowError('forbidden_origin', 403, 'Forbidden origin');
        }
        if (!contributionWorkflow) {
          throw new LeadFlowError('internal_error', 503, 'Contribution service unavailable');
        }
        const body = await parseBody(request, config.contributionMaxBodyBytes);
        parsedBody = body;
        const result = await contributionWorkflow.submit({
          ...body,
          language: body.language ?? body.lang,
          remoteIp: remoteIp(request, config.trustedProxyCidr),
        });
        const contentType = request.headers['content-type']?.split(';')[0]?.trim();
        if (contentType === 'application/x-www-form-urlencoded') {
          return sendContributionRedirect(
            response,
            contributionLanguage(body) === 'en' ? '/en/contribute/?submitted=1' : '/contribua/?submitted=1',
          );
        }
        return sendJson(response, 201, { status: result.status });
      }

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
          const limit = rateLimiter.check(remoteIp(request, config.trustedProxyCidr));
          if (!limit.allowed) {
            return sendJson(response, 429, errorPayload(
              new LeadFlowError('rate_limited', 429, 'Try again later'),
              requestId,
            ), { 'retry-after': String(limit.retryAfter) });
          }
          const result = await workflow.register({ ...body, remoteIp: remoteIp(request, config.trustedProxyCidr) });
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
        }), { 'x-robots-tag': 'noindex, nofollow, noarchive' });
      }
      if (request.method === 'POST' && url.pathname === '/api/contributions/submit') {
        const lang = contributionLanguage(parsedBody);
        const contentType = request.headers['content-type']?.split(';')[0]?.trim();
        const retryHeaders = error?.retryAfter ? { 'retry-after': String(error.retryAfter) } : {};
        if (contentType === 'application/x-www-form-urlencoded') {
          return sendHtml(response, status, contributionFallbackPage({
            config,
            values: parsedBody,
            lang,
            error: contributionMessage(error, lang),
          }), { 'x-robots-tag': 'noindex, nofollow, noarchive', ...retryHeaders });
        }
        return sendJson(response, status, contributionErrorPayload(error, lang), retryHeaders);
      }
      return sendJson(response, status, errorPayload(error, requestId));
    }
  };
}
