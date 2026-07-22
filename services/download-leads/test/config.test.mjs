import assert from 'node:assert/strict';
import test from 'node:test';
import { loadCatalog } from '../src/catalog.mjs';
import { loadConfig } from '../src/config.mjs';

const valid = {
  NODE_ENV: 'test',
  PORT: '8787',
  DATABASE_PATH: ':memory:',
  DOWNLOADS_DIR: '/tmp/files',
  DOWNLOAD_CATALOG_PATH: new URL('../../../config/downloads.json', import.meta.url).pathname,
  ALLOWED_ORIGIN: 'https://produtocomia.com.br',
  COOKIE_SECRET: 'x'.repeat(64),
  TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
  TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
  RESEND_API_KEY: 're_test',
  RESEND_FROM: 'Produto com IA <leads@leads.produtocomia.com.br>',
  LEAD_NOTIFICATION_TO: 'rodrigo.tozato@icloud.com',
};

test('loadConfig rejects missing and weak secrets', () => {
  assert.throws(() => loadConfig({ ...valid, COOKIE_SECRET: 'short' }), /COOKIE_SECRET/);
  assert.throws(() => loadConfig({ ...valid, LEAD_NOTIFICATION_TO: '' }), /LEAD_NOTIFICATION_TO/);
});

test('loadConfig returns normalized immutable values', () => {
  const config = loadConfig(valid);
  assert.equal(config.port, 8787);
  assert.equal(config.allowedOrigin, 'https://produtocomia.com.br');
  assert.equal(config.notificationMode, 'resend');
  assert.equal(config.retentionDays, 730);
  assert.equal(Object.isFrozen(config), true);
});

test('loadConfig rejects insecure production origins and invalid modes', () => {
  assert.throws(
    () => loadConfig({ ...valid, NODE_ENV: 'production', ALLOWED_ORIGIN: 'http://produtocomia.com.br' }),
    /ALLOWED_ORIGIN/,
  );
  assert.throws(() => loadConfig({ ...valid, NOTIFICATION_MODE: 'disabled' }), /NOTIFICATION_MODE/);
});

test('loadCatalog resolves only declared ids and filenames', async () => {
  const catalog = await loadCatalog(valid.DOWNLOAD_CATALOG_PATH);
  assert.equal(catalog.items.length, 12);
  assert.equal(catalog.byId.get('ai-risk-matrix').filename, 'ai-risk-matrix.csv');
  assert.equal(catalog.byFilename.get('../.env'), undefined);
  assert.equal(Object.isFrozen(catalog.items[0]), true);
});
