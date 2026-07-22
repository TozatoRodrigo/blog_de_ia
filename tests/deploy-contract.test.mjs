import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const deploy = await readFile(new URL('../scripts/deploy.sh', import.meta.url), 'utf8');
const smoke = await readFile(new URL('../scripts/smoke-test.mjs', import.meta.url), 'utf8');
const audit = await readFile(new URL('../scripts/audit-dist.mjs', import.meta.url), 'utf8');

test('deployment validates and verifies separate site and service packages', () => {
  assert.ok(deploy.indexOf('npm run validate') < deploy.indexOf('tar -C dist'));
  assert.match(deploy, /SITE_ARCHIVE="\/tmp\/produtocomia-\$\{STAMP\}-site\.tar\.gz"/);
  assert.match(deploy, /SERVICE_ARCHIVE="\/tmp\/produtocomia-\$\{STAMP\}-service\.tar\.gz"/);
  assert.match(deploy, /shasum -a 256 "\$SITE_ARCHIVE"/);
  assert.match(deploy, /shasum -a 256 "\$SERVICE_ARCHIVE"/);
  assert.match(deploy, /sha256sum "\$SITE_ARCHIVE"/);
  assert.match(deploy, /sha256sum "\$SERVICE_ARCHIVE"/);
  assert.doesNotMatch(deploy, /scp[^\n]*\.env\.download-leads/);
});

test('remote activation protects secrets, persistent data and private downloads', () => {
  assert.match(deploy, /test -f "\$BASE\/\.env\.download-leads"/);
  assert.match(deploy, /stat -c %a "\$BASE\/\.env\.download-leads"/);
  assert.match(deploy, /chmod 700 "\$BASE\/lead-data"/);
  assert.match(deploy, /DOWNLOAD_LEADS_UID="\$\(id -u\)"/);
  assert.match(deploy, /DOWNLOAD_LEADS_GID="\$\(id -g\)"/);
  assert.match(deploy, /export DOWNLOAD_LEADS_UID DOWNLOAD_LEADS_GID/);
  assert.match(deploy, /mv "\$NEW_SITE\/downloads" "\$NEW_PRIVATE"/);
  assert.match(deploy, /BACKUP_HTML/);
  assert.match(deploy, /BACKUP_PRIVATE/);
  assert.match(deploy, /BACKUP_NGINX/);
  assert.match(deploy, /BACKUP_COMPOSE/);
  assert.match(deploy, /BACKUP_SERVICE/);
  assert.doesNotMatch(deploy, /(rm|find)[^\n]*lead-data/);
});

test('activation waits for both containers and restores every swapped path', () => {
  assert.match(deploy, /docker compose[^\n]*up -d --build/);
  assert.match(deploy, /produtocomia-download-leads/);
  assert.match(deploy, /produtocomia/);
  assert.match(deploy, /FAILED="\$BASE\/releases\/\$STAMP-failed"/);
  for (const name of ['html', 'private-downloads', 'nginx.conf', 'docker-compose.yml', 'services/download-leads']) {
    assert.match(deploy, new RegExp(name.replace(/[./-]/g, '\\$&')));
  }
  assert.match(deploy, /lead-data/);
});

test('smoke tests cover protected downloads, public discovery and secret-free config', () => {
  for (const path of [
    '/privacidade/', '/en/privacy/', '/api/download-leads/health',
    '/api/download-leads/config', '/downloads/ai-risk-matrix.csv',
    '/api/download-leads/file/invalid', '/llms.txt', '/llms-full.txt', '/sitemap-index.xml',
  ]) {
    assert.match(smoke, new RegExp(path.replace(/[./-]/g, '\\$&')));
  }
  assert.match(smoke, /turnstileSiteKey/);
  assert.match(smoke, /privacyVersion/);
  assert.match(smoke, /TURNSTILE_SECRET_KEY|turnstileSecretKey/);
  assert.match(smoke, /type="email"/);
  assert.match(smoke, /\/downloads\/ai-risk-matrix\.csv\?smoke=\$\{Date\.now\(\)\}/);
});

test('build audit derives required protected files from the catalog', () => {
  assert.match(audit, /config\/downloads\.json/);
  assert.match(audit, /downloadCatalog/);
  assert.match(audit, /downloads\/\$\{item\.filename\}/);
});
