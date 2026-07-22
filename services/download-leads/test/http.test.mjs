import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createLeadDatabase } from '../src/database.mjs';
import { createLeadHandler } from '../src/http.mjs';
import { createRateLimiter } from '../src/security.mjs';
import { createLeadWorkflow } from '../src/workflow.mjs';

const material = Object.freeze({
  id: 'ai-risk-matrix',
  filename: 'ai-risk-matrix.csv',
  contentType: 'text/csv; charset=utf-8',
  labels: Object.freeze({ 'pt-BR': 'Matriz de risco de IA', en: 'AI risk matrix' }),
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
    privacyVersion: '2026-07-22',
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
  const handler = createLeadHandler({
    config,
    catalog,
    workflow,
    rateLimiter: createRateLimiter({ secret: config.cookieSecret }),
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

test('exposes only public client configuration and a real health check', async () => {
  const app = await setup();
  try {
    const configResponse = await fetch(`${app.baseUrl}/api/download-leads/config`);
    assert.equal(configResponse.status, 200);
    assert.deepEqual(await configResponse.json(), {
      turnstileSiteKey: '1x00000000000000000000AA',
      privacyVersion: '2026-07-22',
    });
    assert.equal(configResponse.headers.get('cache-control'), 'no-store');

    const health = await fetch(`${app.baseUrl}/api/download-leads/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: 'ok' });
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
    const html = await response.text();
    assert.match(html, /Get the free resource/);
    assert.match(html, /type="email"/);
    assert.match(html, /\/en\/privacy\//);
    assert.match(html, /challenges\.cloudflare\.com\/turnstile/);
    assert.doesNotMatch(html, /EXAMPLE,low/);
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
    assert.match(html, /Get the free resource/);
    assert.match(html, /Enter a valid email/);
    assert.match(html, /name="materialId" value="ai-risk-matrix"/);
  } finally {
    await app.close();
  }
});
