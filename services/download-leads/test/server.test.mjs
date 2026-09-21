import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createApplication } from '../src/server.mjs';

async function createTestApplication({ fetchImpl, logger } = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'lead-server-lifecycle-'));
  const downloads = join(directory, 'downloads');
  await mkdir(downloads);
  await writeFile(join(downloads, 'resource.csv'), 'id,value\nEXAMPLE,1\n');
  const catalogPath = join(directory, 'downloads.json');
  await writeFile(catalogPath, JSON.stringify([{
    id: 'resource',
    filename: 'resource.csv',
    contentType: 'text/csv; charset=utf-8',
    language: 'pt-BR',
    labels: { 'pt-BR': 'Recurso', en: 'Resource' },
    description: { 'pt-BR': 'Descrição do recurso.', en: 'Resource description.' },
    relatedUrl: { 'pt-BR': '/guias/', en: '/en/guides/' },
  }]));

  return createApplication({
    env: {
      NODE_ENV: 'test',
      PORT: '8787',
      DATABASE_PATH: ':memory:',
      DOWNLOADS_DIR: downloads,
      DOWNLOAD_CATALOG_PATH: catalogPath,
      ALLOWED_ORIGIN: 'https://produtocomia.com.br',
      COOKIE_SECRET: 's'.repeat(64),
      TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
      TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
      RESEND_API_KEY: 're_test',
      RESEND_FROM: 'Produto com IA <leads@leads.produtocomia.com.br>',
      LEAD_NOTIFICATION_TO: 'rodrigo.tozato@icloud.com',
      NOTIFICATION_MODE: 'resend',
    },
    fetchImpl,
    logger,
  });
}

test('composes the service without starting network listeners during import', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lead-server-'));
  const downloads = join(directory, 'downloads');
  await mkdir(downloads);
  await writeFile(join(downloads, 'resource.csv'), 'id,value\nEXAMPLE,1\n');
  const catalogPath = join(directory, 'downloads.json');
  await writeFile(catalogPath, JSON.stringify([{
    id: 'resource',
    filename: 'resource.csv',
    contentType: 'text/csv; charset=utf-8',
    language: 'pt-BR',
    labels: { 'pt-BR': 'Recurso', en: 'Resource' },
    description: { 'pt-BR': 'Descrição do recurso.', en: 'Resource description.' },
    relatedUrl: { 'pt-BR': '/guias/', en: '/en/guides/' },
  }]));

  const app = await createApplication({
    env: {
      NODE_ENV: 'test',
      PORT: '8787',
      DATABASE_PATH: ':memory:',
      DOWNLOADS_DIR: downloads,
      DOWNLOAD_CATALOG_PATH: catalogPath,
      ALLOWED_ORIGIN: 'https://produtocomia.com.br',
      COOKIE_SECRET: 's'.repeat(64),
      TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
      TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
      RESEND_FROM: 'Produto com IA <leads@leads.produtocomia.com.br>',
      LEAD_NOTIFICATION_TO: 'rodrigo.tozato@icloud.com',
      NOTIFICATION_MODE: 'log',
    },
  });

  assert.equal(app.server.listening, false);
  assert.equal(app.config.notificationMode, 'log');
  assert.ok(app.contributionRateLimiter);
  for (let attempt = 0; attempt < app.config.contributionRateLimitAttempts; attempt += 1) {
    assert.equal(app.contributionRateLimiter.check('198.51.100.10').allowed, true);
  }
  const blocked = app.contributionRateLimiter.check('198.51.100.10');
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfter > 0);
  await assert.rejects(
    () => app.contributionWorkflow.submit({ remoteIp: '198.51.100.10' }),
    (error) => error.code === 'rate_limited' && error.status === 429,
  );
  assert.equal(await app.workflow.health(), true);
  assert.deepEqual(await app.runNotifications(), { sent: 0, failed: 0 });
  await app.close();
});

test('processes a pending contribution during application startup', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lead-server-start-'));
  const downloads = join(directory, 'downloads');
  await mkdir(downloads);
  await writeFile(join(downloads, 'resource.csv'), 'id,value\nEXAMPLE,1\n');
  const catalogPath = join(directory, 'downloads.json');
  await writeFile(catalogPath, JSON.stringify([{
    id: 'resource',
    filename: 'resource.csv',
    contentType: 'text/csv; charset=utf-8',
    language: 'pt-BR',
    labels: { 'pt-BR': 'Recurso', en: 'Resource' },
    description: { 'pt-BR': 'Descrição do recurso.', en: 'Resource description.' },
    relatedUrl: { 'pt-BR': '/guias/', en: '/en/guides/' },
  }]));

  const app = await createApplication({
    env: {
      NODE_ENV: 'test',
      PORT: '8787',
      DATABASE_PATH: ':memory:',
      DOWNLOADS_DIR: downloads,
      DOWNLOAD_CATALOG_PATH: catalogPath,
      ALLOWED_ORIGIN: 'https://produtocomia.com.br',
      COOKIE_SECRET: 's'.repeat(64),
      TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
      TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
      RESEND_FROM: 'Produto com IA <leads@leads.produtocomia.com.br>',
      LEAD_NOTIFICATION_TO: 'rodrigo.tozato@icloud.com',
      NOTIFICATION_MODE: 'log',
    },
  });

  app.db.createEditorialSubmission({
    name: 'Pessoa autora',
    email: 'autora@example.com',
    title: 'Uma contribuição útil',
    excerpt: 'Resumo editorial.',
    content: 'Texto completo.',
    bio: 'Bio curta.',
    language: 'pt-BR',
    sourcePath: '/contribua/',
    privacyVersion: '2026-09-21',
  });

  try {
    await app.start();
    assert.deepEqual(app.db.pendingContributionNotifications(10), []);
    assert.deepEqual(app.db.failedContributionNotifications(10), []);
  } finally {
    await app.close();
  }
});

test('shutdown waits for an in-flight notification batch before closing SQLite', async () => {
  let releaseRequest;
  const requestStarted = new Promise((resolve) => {
    releaseRequest = resolve;
  });
  let releaseResponse;
  const responseReady = new Promise((resolve) => {
    releaseResponse = resolve;
  });
  const app = await createTestApplication({
    fetchImpl: async () => {
      releaseRequest();
      await responseReady;
      return new Response(JSON.stringify({ id: 'notification-id' }), { status: 200 });
    },
  });
  app.db.createEditorialSubmission({
    name: 'Pessoa autora',
    email: 'autora@example.com',
    title: 'Uma contribuição útil',
    excerpt: 'Resumo editorial.',
    content: 'Texto completo.',
    bio: 'Bio curta.',
    language: 'pt-BR',
    sourcePath: '/contribua/',
    privacyVersion: '2026-09-21',
  });

  const notificationRun = app.runNotifications();
  await requestStarted;
  let closed = false;
  const closeRun = app.close().then(() => {
    closed = true;
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(closed, false);

  releaseResponse();
  assert.deepEqual(await notificationRun, { sent: 1, failed: 0 });
  await closeRun;
  assert.equal(closed, true);
});

test('shutdown waits for a sibling notification after the other batch fails early', async () => {
  let releaseDownloadResponse;
  let releaseContributionResponse;
  let markRequestStarted;
  const requestStarted = new Promise((resolve) => {
    let count = 0;
    markRequestStarted = () => {
      count += 1;
      if (count === 2) resolve();
    };
  });
  const app = await createTestApplication({
    fetchImpl: async (_url, options) => {
      markRequestStarted();
      const release = options.headers['idempotency-key'].startsWith('download-event/')
        ? (resolve) => { releaseDownloadResponse = resolve; }
        : (resolve) => { releaseContributionResponse = resolve; };
      return new Promise(release);
    },
  });
  const storedLead = app.db.upsertLead({
    email: 'pessoa@example.com',
    marketingOptIn: false,
    privacyVersion: '2026-09-21',
  });
  for (let index = 0; index < 2; index += 1) {
    app.db.createDownloadEvent({
      leadId: storedLead.id,
      materialId: 'resource',
      sourcePath: '/guias/recurso/',
      lang: 'pt-BR',
    });
  }
  app.db.createEditorialSubmission({
    name: 'Pessoa autora',
    email: 'autora@example.com',
    title: 'Uma contribuição útil',
    excerpt: 'Resumo editorial.',
    content: 'Texto completo.',
    bio: 'Bio curta.',
    language: 'pt-BR',
    sourcePath: '/contribua/',
    privacyVersion: '2026-09-21',
  });

  const originalGet = app.catalog.byId.get;
  let lookups = 0;
  app.catalog.byId.get = (...args) => {
    lookups += 1;
    if (lookups === 2) throw new Error('download sibling failed');
    return originalGet.apply(app.catalog.byId, args);
  };

  const notificationRun = app.runNotifications();
  await requestStarted;
  releaseDownloadResponse(new Response(JSON.stringify({ id: 'download-id' }), { status: 200 }));

  let closed = false;
  const closeRun = app.close().then(() => {
    closed = true;
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(closed, false);

  releaseContributionResponse(new Response(JSON.stringify({ id: 'contribution-id' }), { status: 200 }));
  await assert.rejects(notificationRun, /download sibling failed/);
  await closeRun;
  assert.equal(closed, true);
});

test('logs notification batch failures during startup', async () => {
  const errors = [];
  const app = await createTestApplication({
    logger: { error: (...args) => errors.push(args) },
    fetchImpl: async () => new Response(JSON.stringify({ id: 'unused' }), { status: 200 }),
  });
  app.db.close();

  await assert.rejects(() => app.start());
  assert.equal(errors.length, 1);
  assert.match(String(errors[0][0]), /startup/);
});
