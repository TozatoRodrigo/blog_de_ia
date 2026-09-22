import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createLeadDatabase } from '../src/database.mjs';
import { createContributionWorkflow } from '../src/contribution-workflow.mjs';
import { createLeadHandler, remoteIp } from '../src/http.mjs';
import { createRateLimiter } from '../src/security.mjs';
import { createLeadWorkflow } from '../src/workflow.mjs';

const material = Object.freeze({
  id: 'ai-risk-matrix',
  filename: 'ai-risk-matrix.csv',
  language: 'en',
  contentType: 'text/csv; charset=utf-8',
  labels: Object.freeze({ 'pt-BR': 'Matriz de risco de IA', en: 'AI risk matrix' }),
  description: Object.freeze({
    'pt-BR': 'Matriz para classificar riscos de IA por impacto, evidência, controle e responsável.',
    en: 'Matrix for classifying AI risks by impact, evidence, control, and owner.',
  }),
  relatedUrl: Object.freeze({ 'pt-BR': '/guias/matriz-risco-ia/', en: '/en/guides/ai-risk-matrix/' }),
});

async function setup() {
  const directory = await mkdtemp(join(tmpdir(), 'lead-http-'));
  const downloadsDir = join(directory, 'downloads');
  await mkdir(downloadsDir);
  await writeFile(join(downloadsDir, material.filename), 'id,risk\nEXAMPLE,low\n');
  const config = Object.freeze({
    allowedOrigin: 'https://produtocomia.com.br',
    cookieSecret: 's'.repeat(64),
    sessionDays: 180,
    authorizationSeconds: 300,
    maxBodyBytes: 16 * 1024,
    downloadsDir,
    turnstileSecretKey: 'turnstile-secret',
    turnstileSiteKey: '1x00000000000000000000AA',
    notificationTo: 'rodrigo.tozato@icloud.com',
    privacyVersion: '2026-07-22',
    contributionPrivacyVersion: '2026-09-21',
    contributionMaxBodyBytes: 96 * 1024,
    trustedProxyCidr: '172.30.0.0/24',
  });
  const catalog = Object.freeze({
    items: Object.freeze([material]),
    byId: new Map([[material.id, material]]),
    byFilename: new Map([[material.filename, material]]),
  });
  let id = 0;
  const db = createLeadDatabase({
    path: ':memory:',
    clock: () => new Date('2026-07-22T15:00:00.000Z'),
    randomUUID: () => `http-${++id}`,
  });
  const workflow = createLeadWorkflow({
    config,
    catalog,
    db,
    verifyTurnstileFn: async ({ token }) => token === 'valid-turnstile',
    clock: () => new Date('2026-07-22T15:00:00.000Z'),
  });
  const contributionWorkflow = createContributionWorkflow({
    config,
    db,
    rateLimiter: createRateLimiter({ secret: config.cookieSecret, maxAttempts: 5 }),
    verifyTurnstileFn: async ({ token, action }) => token === 'valid-contribution-turnstile' && action === 'contribution_submit',
    clock: () => new Date('2026-07-22T15:00:00.000Z'),
  });
  const handler = createLeadHandler({
    config,
    catalog,
    workflow,
    rateLimiter: createRateLimiter({ secret: config.cookieSecret }),
    contributionWorkflow,
  });
  const server = createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  return {
    baseUrl,
    db,
    close: async () => {
      await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
      db.close();
    },
  };
}

function jsonRequest(body, extraHeaders = {}) {
  return {
    method: 'POST',
    headers: {
      origin: 'https://produtocomia.com.br',
      'content-type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

const validRegistration = Object.freeze({
  email: 'pessoa@example.com',
  marketingOptIn: false,
  privacyVersion: '2026-07-22',
  materialId: material.id,
  sourcePath: '/guias/matriz-risco-ia/?email=remove@example.com',
  lang: 'pt-BR',
  campaign: 'linkedin',
  turnstileToken: 'valid-turnstile',
  company: '',
});

const validContribution = Object.freeze({
  name: 'Pessoa autora',
  email: 'autora@example.com',
  role: 'Product Manager',
  siteUrl: 'https://example.com/',
  title: 'Uma contribuição útil',
  excerpt: 'Resumo editorial da contribuição.',
  content: 'Texto completo da contribuição.',
  links: 'https://example.com/referencia',
  bio: 'Bio curta da pessoa autora.',
  lang: 'pt-BR',
  privacyVersion: '2026-09-21',
  turnstileToken: 'valid-contribution-turnstile',
  company: '',
  sourcePath: '/contribua/',
  consent: 'on',
});

test('exposes only public client configuration and a real health check', async () => {
  const app = await setup();
  try {
    const configResponse = await fetch(`${app.baseUrl}/api/download-leads/config`);
    assert.equal(configResponse.status, 200);
    assert.deepEqual(await configResponse.json(), {
      turnstileSiteKey: '1x00000000000000000000AA',
      privacyVersion: '2026-07-22',
      contributionPrivacyVersion: '2026-09-21',
    });
    assert.equal(configResponse.headers.get('cache-control'), 'no-store');

    const health = await fetch(`${app.baseUrl}/api/download-leads/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: 'ok' });
  } finally {
    await app.close();
  }
});

test('keeps download and contribution privacy versions separate across public config and submissions', async () => {
  const app = await setup();
  try {
    const download = await fetch(`${app.baseUrl}/api/download-leads/register`, jsonRequest(validRegistration));
    assert.equal(download.status, 201);

    const contribution = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest(validContribution));
    assert.equal(contribution.status, 201);
    assert.equal(app.db.pendingNotifications(10).length, 1);
    assert.equal(app.db.pendingContributionNotifications(10).length, 1);
  } finally {
    await app.close();
  }
});

test('rejects unsafe registration requests before storing a lead', async () => {
  const app = await setup();
  try {
    const wrongOrigin = await fetch(`${app.baseUrl}/api/download-leads/register`, jsonRequest(validRegistration, { origin: 'https://evil.example' }));
    assert.equal(wrongOrigin.status, 403);

    const honeypot = await fetch(`${app.baseUrl}/api/download-leads/register`, jsonRequest({ ...validRegistration, company: 'ACME' }));
    assert.equal(honeypot.status, 400);

    const invalidEmail = await fetch(`${app.baseUrl}/api/download-leads/register`, jsonRequest({ ...validRegistration, email: 'invalid' }));
    assert.equal(invalidEmail.status, 400);

    const unknownMaterial = await fetch(`${app.baseUrl}/api/download-leads/register`, jsonRequest({ ...validRegistration, materialId: 'unknown' }));
    assert.equal(unknownMaterial.status, 404);

    const invalidTurnstile = await fetch(`${app.baseUrl}/api/download-leads/register`, jsonRequest({ ...validRegistration, turnstileToken: 'invalid' }));
    assert.equal(invalidTurnstile.status, 400);

    const tooLarge = await fetch(`${app.baseUrl}/api/download-leads/register`, jsonRequest({ ...validRegistration, padding: 'x'.repeat(17_000) }));
    assert.equal(tooLarge.status, 413);
    assert.deepEqual(app.db.pendingNotifications(10), []);
  } finally {
    await app.close();
  }
});

test('registers once, sets a secure session and streams an authorized file', async () => {
  const app = await setup();
  try {
    const response = await fetch(`${app.baseUrl}/api/download-leads/register`, jsonRequest(validRegistration));
    assert.equal(response.status, 201);
    const setCookie = response.headers.get('set-cookie');
    assert.match(setCookie, /HttpOnly; Secure; SameSite=Lax/);
    const cookie = setCookie.split(';')[0];
    const payload = await response.json();
    assert.match(payload.downloadUrl, /^\/api\/download-leads\/file\/[A-Za-z0-9_-]{43}$/);
    assert.equal(payload.email, undefined);
    assert.equal(app.db.pendingNotifications(10).length, 1);
    assert.equal(app.db.pendingNotifications(10)[0].sourcePath, '/guias/matriz-risco-ia/');

    const file = await fetch(`${app.baseUrl}${payload.downloadUrl}`);
    assert.equal(file.status, 200);
    assert.equal(file.headers.get('content-type'), material.contentType);
    assert.match(file.headers.get('content-disposition'), /attachment; filename="ai-risk-matrix.csv"/);
    assert.equal(file.headers.get('cache-control'), 'private, no-store');
    assert.equal(file.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(await file.text(), 'id,risk\nEXAMPLE,low\n');

    const returning = await fetch(`${app.baseUrl}/api/download-leads/authorize`, jsonRequest({
      materialId: material.id,
      sourcePath: '/guias/matriz-risco-ia/',
      lang: 'pt-BR',
      campaign: null,
    }, { cookie }));
    assert.equal(returning.status, 200);
    assert.match((await returning.json()).downloadUrl, /^\/api\/download-leads\/file\//);
    assert.equal(app.db.pendingNotifications(10).length, 2);

    const unauthorized = await fetch(`${app.baseUrl}/api/download-leads/authorize`, jsonRequest({
      materialId: material.id,
      sourcePath: '/',
      lang: 'pt-BR',
    }));
    assert.equal(unauthorized.status, 401);
    assert.equal((await fetch(`${app.baseUrl}/api/download-leads/file/invalid`)).status, 404);
  } finally {
    await app.close();
  }
});

test('renders a localized no-JavaScript fallback for direct download links', async () => {
  const app = await setup();
  try {
    const response = await fetch(`${app.baseUrl}/downloads/${material.filename}?lang=en`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive');
    const html = await response.text();
    assert.match(html, /<title>AI risk matrix/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.match(html, /<meta name="robots" content="noindex, nofollow, noarchive"/);
    assert.match(html, /<link rel="canonical" href="https:\/\/produtocomia\.com\.br\/downloads\/ai-risk-matrix\.csv"/);
    assert.match(html, /Download the resource/);
    assert.match(html, /type="email"/);
    assert.match(html, /\/en\/privacy\//);
    assert.match(html, /challenges\.cloudflare\.com\/turnstile/);
    assert.doesNotMatch(html, /EXAMPLE,low/);
  } finally {
    await app.close();
  }
});

test('redirects the download root and localized query URLs to clean paths', async () => {
  const app = await setup();
  try {
    const root = await fetch(`${app.baseUrl}/downloads/`, { redirect: 'manual' });
    assert.equal(root.status, 301);
    assert.equal(root.headers.get('location'), '/guias/');

    const englishRoot = await fetch(`${app.baseUrl}/downloads/?lang=en`, { redirect: 'manual' });
    assert.equal(englishRoot.status, 301);
    assert.equal(englishRoot.headers.get('location'), '/en/guides/');

    const clean = await fetch(`${app.baseUrl}/downloads/${material.filename}?lang=en`, { redirect: 'manual' });
    assert.equal(clean.status, 301);
    assert.equal(clean.headers.get('location'), `/downloads/${material.filename}`);
  } finally {
    await app.close();
  }
});

test('submits the no-JavaScript form and redirects to the protected file', async () => {
  const app = await setup();
  try {
    const form = new URLSearchParams({
      email: validRegistration.email,
      marketingOptIn: 'false',
      privacyVersion: validRegistration.privacyVersion,
      materialId: validRegistration.materialId,
      sourcePath: validRegistration.sourcePath,
      lang: validRegistration.lang,
      turnstileToken: validRegistration.turnstileToken,
      company: '',
    });
    const response = await fetch(`${app.baseUrl}/api/download-leads/register-form`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        origin: 'https://produtocomia.com.br',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: form,
    });
    assert.equal(response.status, 303);
    assert.match(response.headers.get('location'), /^\/api\/download-leads\/file\//);
    assert.match(response.headers.get('set-cookie'), /pcm_lead=/);
  } finally {
    await app.close();
  }
});

test('keeps the no-JavaScript form localized after a validation error', async () => {
  const app = await setup();
  try {
    const form = new URLSearchParams({
      email: 'invalid',
      marketingOptIn: 'false',
      privacyVersion: validRegistration.privacyVersion,
      materialId: validRegistration.materialId,
      sourcePath: '/downloads/ai-risk-matrix.csv',
      lang: 'en',
      turnstileToken: validRegistration.turnstileToken,
      company: '',
    });
    const response = await fetch(`${app.baseUrl}/api/download-leads/register-form`, {
      method: 'POST',
      headers: {
        origin: 'https://produtocomia.com.br',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: form,
    });
    assert.equal(response.status, 400);
    const html = await response.text();
    assert.match(html, /Download the resource/);
    assert.match(html, /Enter a valid email/);
    assert.match(html, /name="materialId" value="ai-risk-matrix"/);
  } finally {
    await app.close();
  }
});

test('contribution endpoint accepts valid JSON without exposing internal fields', async () => {
  const app = await setup();
  try {
    const response = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest(validContribution));
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { status: 'pending' });
    assert.equal(app.db.pendingContributionNotifications(10).length, 1);
  } finally {
    await app.close();
  }
});

test('contribution endpoint rejects unsafe JSON requests without echoing submitted data', async () => {
  const app = await setup();
  try {
    const wrongOrigin = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest(validContribution, { origin: 'https://evil.example' }));
    assert.equal(wrongOrigin.status, 403);

    const honeypot = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest({ ...validContribution, company: 'ACME' }));
    assert.equal(honeypot.status, 400);

    const missingConsent = { ...validContribution };
    delete missingConsent.consent;
    const missingConsentResponse = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest(missingConsent));
    assert.equal(missingConsentResponse.status, 400);
    assert.deepEqual(await missingConsentResponse.json(), {
      error: 'invalid_submission',
      field: 'consent',
      message: 'Confira a autorização de autoria e tente novamente.',
    });

    const falseConsent = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest({ ...validContribution, consent: false }));
    assert.equal(falseConsent.status, 400);
    assert.equal((await falseConsent.json()).field, 'consent');

    const forgedConsent = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest({ ...validContribution, consent: 'accepted' }));
    assert.equal(forgedConsent.status, 400);
    assert.equal((await forgedConsent.json()).error, 'invalid_submission');

    const invalidEmail = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest({ ...validContribution, email: 'invalid' }));
    assert.equal(invalidEmail.status, 400);
    const invalidEmailPayload = await invalidEmail.json();
    assert.deepEqual(invalidEmailPayload.error, 'invalid_email');
    assert.deepEqual(invalidEmailPayload.field, 'email');
    assert.equal(invalidEmailPayload.message, 'Digite um e-mail válido.');
    assert.doesNotMatch(JSON.stringify(invalidEmailPayload), /example\.com|Uma contribuição/);

    const invalidUrl = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest({
      ...validContribution,
      siteUrl: 'javascript:alert("site")',
    }));
    assert.equal(invalidUrl.status, 400);
    const invalidUrlPayload = await invalidUrl.json();
    assert.deepEqual(invalidUrlPayload.error, 'invalid_url');
    assert.deepEqual(invalidUrlPayload.field, 'siteUrl');
    assert.doesNotMatch(JSON.stringify(invalidUrlPayload), /javascript|alert|example\.com/);

    const invalidContent = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest({
      ...validContribution,
      content: '',
    }));
    assert.equal(invalidContent.status, 400);
    const invalidContentPayload = await invalidContent.json();
    assert.deepEqual(invalidContentPayload.error, 'invalid_submission');
    assert.deepEqual(invalidContentPayload.field, 'content');
    assert.doesNotMatch(JSON.stringify(invalidContentPayload), /valid-contribution|example\.com|Uma contribuição/);

    const invalidTurnstile = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest({ ...validContribution, turnstileToken: 'invalid' }));
    assert.equal(invalidTurnstile.status, 400);
    assert.deepEqual((await invalidTurnstile.json()).error, 'turnstile_failed');

    const tooLarge = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest({ ...validContribution, content: 'x'.repeat(100_000) }));
    assert.equal(tooLarge.status, 413);
    assert.deepEqual(app.db.pendingContributionNotifications(10), []);
  } finally {
    await app.close();
  }
});

test('contribution form rejects missing and false consent', async () => {
  const app = await setup();
  try {
    const missingConsent = new URLSearchParams(validContribution);
    missingConsent.delete('consent');
    const missingResponse = await fetch(`${app.baseUrl}/api/contributions/submit`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        origin: 'https://produtocomia.com.br',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: missingConsent,
    });
    assert.equal(missingResponse.status, 400);
    assert.match(await missingResponse.text(), /Confira a autorização de autoria e tente novamente/);

    const falseConsent = await fetch(`${app.baseUrl}/api/contributions/submit`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        origin: 'https://produtocomia.com.br',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ ...validContribution, consent: 'false' }),
    });
    assert.equal(falseConsent.status, 400);
    assert.match(await falseConsent.text(), /Confira a autorização de autoria/);
    assert.deepEqual(app.db.pendingContributionNotifications(10), []);
  } finally {
    await app.close();
  }
});

test('contribution endpoint rate limits repeated submissions', async () => {
  const app = await setup();
  try {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest({
        ...validContribution,
        title: `${validContribution.title} ${attempt}`,
      }));
      assert.equal(response.status, 201);
    }
    const blocked = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest(validContribution));
    assert.equal(blocked.status, 429);
    assert.ok(Number(blocked.headers.get('retry-after')) > 0);
    assert.deepEqual((await blocked.json()).error, 'rate_limited');
  } finally {
    await app.close();
  }
});

test('does not let direct CF-Connecting-IP or X-Forwarded-For headers choose rate-limit identities', async () => {
  const app = await setup();
  try {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest({
        ...validContribution,
        title: `${validContribution.title} spoof ${attempt}`,
      }, {
        'cf-connecting-ip': `198.51.100.${attempt + 10}`,
        'x-forwarded-for': `203.0.113.${attempt + 10}`,
        'x-real-ip': `192.0.2.${attempt + 10}`,
      }));
      assert.equal(response.status, 201);
    }

    const blocked = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest({
      ...validContribution,
      title: `${validContribution.title} spoof blocked`,
      }, {
        'cf-connecting-ip': '203.0.113.99',
        'x-forwarded-for': '198.51.100.99',
        'x-real-ip': '192.0.2.99',
      }));
    assert.equal(blocked.status, 429);
    assert.equal((await blocked.json()).error, 'rate_limited');
  } finally {
    await app.close();
  }
});

test('accepts sanitized X-Real-IP only from the exact internal proxy boundary', () => {
  const trustedRequest = {
    socket: { remoteAddress: '172.30.0.2' },
    headers: {
      'x-real-ip': '198.51.100.10',
      'cf-connecting-ip': '203.0.113.10',
      'x-forwarded-for': '192.0.2.10',
    },
  };
  const untrustedRequest = {
    ...trustedRequest,
    socket: { remoteAddress: '172.18.0.4' },
  };

  assert.equal(remoteIp(trustedRequest, '172.30.0.0/24'), '198.51.100.10');
  assert.equal(remoteIp(untrustedRequest, '172.30.0.0/24'), '172.18.0.4');
});

test('contribution form submission redirects to the localized success state', async () => {
  const app = await setup();
  try {
    const response = await fetch(`${app.baseUrl}/api/contributions/submit`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        origin: 'https://produtocomia.com.br',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(validContribution),
    });
    assert.equal(response.status, 303);
    assert.equal(response.headers.get('location'), '/contribua/?submitted=1');
  } finally {
    await app.close();
  }
});

test('contribution form errors render escaped localized fallback HTML', async () => {
  const app = await setup();
  try {
    const response = await fetch(`${app.baseUrl}/api/contributions/submit`, {
      method: 'POST',
      headers: {
        origin: 'https://produtocomia.com.br',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        ...validContribution,
        lang: 'en',
        sourcePath: '/en/contribute/',
        email: 'invalid',
        content: '<script>alert("article")</script>',
        title: '<b>Unsafe title</b>',
      }),
    });
    assert.equal(response.status, 400);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive');
    const html = await response.text();
    assert.match(html, /Enter a valid email/);
    assert.match(html, /id="contribution-email"[^>]*aria-invalid="true"[^>]*aria-describedby="contribution-email-error"/);
    assert.match(html, /<p id="contribution-email-error"[^>]*data-field-error="email"[^>]*>Enter a valid email\.<\/p>/);
    assert.match(html, /&lt;script&gt;alert\(&quot;article&quot;\)&lt;\/script&gt;/);
    assert.doesNotMatch(html, /<script>alert/);
    assert.match(html, /\/en\/privacy\//);
    assert.match(html, /\/en\/about#contact/);
    assert.match(html, /<a data-contact-direct="true" href="mailto:rodrigo\.tozato@icloud\.com">Contact the editor<\/a>/);
    assert.match(html, /<noscript>[\s\S]*JavaScript is required to complete Cloudflare Turnstile/);
    assert.match(html, /cannot verify the submission/);
  } finally {
    await app.close();
  }
});

test('contribution fallback associates localized errors with site, links, content, and consent fields', async () => {
  const app = await setup();
  try {
    const cases = [
      ['siteUrl', 'javascript:alert("site")', 'Use valid links beginning with http or https.'],
      ['links', 'ftp://bad.example', 'Use valid links beginning with http or https.'],
      ['content', ' ', 'Add the full contribution text.'],
    ];
    for (const [field, value, message] of cases) {
      const response = await fetch(`${app.baseUrl}/api/contributions/submit`, {
        method: 'POST',
        headers: {
          origin: 'https://produtocomia.com.br',
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ ...validContribution, lang: 'en', [field]: value }),
      });
      assert.equal(response.status, 400);
      const html = await response.text();
      const inputId = field === 'siteUrl' ? 'contribution-site' : `contribution-${field}`;
      assert.match(html, new RegExp(`id="${inputId}"[^>]*aria-invalid="true"[^>]*aria-describedby="${inputId}-error"`));
      const escapedMessage = message.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
      assert.match(html, new RegExp(`<p id="${inputId}-error"[^>]*data-field-error="${field}"[^>]*>${escapedMessage}<\\/p>`));
      assert.doesNotMatch(html, /<script>alert/);
    }

    const consent = new URLSearchParams(validContribution);
    consent.delete('consent');
    consent.set('lang', 'en');
    const consentResponse = await fetch(`${app.baseUrl}/api/contributions/submit`, {
      method: 'POST',
      headers: {
        origin: 'https://produtocomia.com.br',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: consent,
    });
    assert.equal(consentResponse.status, 400);
    const consentHtml = await consentResponse.text();
    assert.match(consentHtml, /id="contribution-consent"[^>]*aria-invalid="true"[^>]*aria-describedby="contribution-consent-error"/);
    assert.match(consentHtml, /data-field-error="consent"[^>]*>Confirm authorship authorization and try again\.<\/p>/);
  } finally {
    await app.close();
  }
});
