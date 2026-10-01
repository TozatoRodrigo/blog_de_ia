import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const deploy = await readFile(new URL('../scripts/deploy.sh', import.meta.url), 'utf8');
const remote = await readFile(new URL('../scripts/lib/editorial-deploy-remote.sh', import.meta.url), 'utf8');
const smoke = await readFile(new URL('../scripts/smoke-test.mjs', import.meta.url), 'utf8');
const audit = await readFile(new URL('../scripts/audit-dist.mjs', import.meta.url), 'utf8');
const nginx = await readFile(new URL('../deploy/nginx.conf', import.meta.url), 'utf8');
const compose = await readFile(new URL('../deploy/docker-compose.yml', import.meta.url), 'utf8');

test('editorial deployment validates a site package and infrastructure fingerprints', () => {
  assert.ok(deploy.indexOf('npm run validate') < deploy.indexOf('tar -C dist'));
  assert.match(deploy, /shasum -a 256 "\$SITE_ARCHIVE"/);
  assert.match(deploy, /newsletter-infrastructure\.mjs manifest/);
  assert.match(remote, /compare_infrastructure/);
  assert.match(remote, /test "\$\(sha "\$INPUT\/site\.tar\.gz"\)" = "\$EXPECTED_SITE_SHA"/);
  assert.doesNotMatch(deploy, /SERVICE_ARCHIVE|tar[^\n]*private-downloads/);
  assert.doesNotMatch(deploy, /scp[^\n]*\.env\.download-leads/);
});

test('editorial activation preserves secrets, data and private downloads', () => {
  assert.match(remote, /test -f "\$BASE\/\.env\.download-leads"/);
  assert.match(remote, /statSync[\s\S]*= 600/);
  for (const path of ['lead-data', 'private-downloads', 'services/download-leads']) {
    assert.match(remote, new RegExp(`test -d "\\$BASE/${path}"`));
  }
  assert.doesNotMatch(remote, /(?:mv|cp|chmod|unlink|rm)[^\n]*\$BASE\/(?:lead-data|private-downloads|services)/);
  assert.doesNotMatch(remote, /(?:docker compose|docker stop|docker restart|docker rm)/);
  assert.match(remote, /nginx.before/);
  assert.match(remote, /previous-target/);
});

test('activation keeps container identities and restores the active static version', () => {
  assert.match(remote, /containers.before/);
  assert.match(remote, /containers.after/);
  assert.match(remote, /unchanged_containers/);
  assert.match(remote, /nginx -t/);
  assert.match(remote, /nginx -s reload/);
  assert.match(remote, /rolled-back/);
  assert.match(deploy, /rollback-verification.json/);
  assert.ok(deploy.indexOf('newsletter-continuity.mjs verify') < deploy.indexOf('remote_action finalize'));
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
  assert.match(smoke, /\/robots\.txt\?smoke=\$\{Date\.now\(\)\}/);
  for (const path of ['/contribua/', '/en/contribute/', '/privacidade/', '/en/privacy/']) {
    assert.match(smoke, new RegExp(path.replace(/[./-]/g, '\\$&')));
  }
  assert.match(smoke, /data-contact-direct="true"/);
  assert.match(smoke, /cdn-cgi\/l\/email-protection/);
});

test('the lead service is isolated behind the Nginx-only internal network', () => {
  assert.match(compose, /produtocomia:\n[\s\S]*- proxy\n\s+- leads-internal/);
  assert.match(compose, /^  download-leads:\n[\s\S]*?^    networks:\n\s+- leads-internal/m);
  assert.doesNotMatch(compose, /^  download-leads:[\s\S]*?^    networks:[\s\S]*?- proxy/m);
  assert.match(compose, /leads-internal:\n\s+internal: true\n\s+ipam:[\s\S]*?subnet: 172\.30\.0\.0\/24/);
});

test('build audit keeps protected downloads out of static output', () => {
  assert.match(audit, /private-assets-leaked/);
  assert.match(audit, /pathname\.startsWith\('\/downloads\/'\)/);
  assert.doesNotMatch(audit, /downloadCatalog/);
});

test('Nginx permanently redirects legacy newsletters before static routing', () => {
  assert.match(nginx, /map_hash_bucket_size 128;/);
  assert.match(nginx, /absolute_redirect off;/);
  assert.match(nginx, /include \/usr\/share\/nginx\/html\/current\/_newsletter-redirects\.map;/);
  assert.match(nginx, /return 301 \$newsletter_redirect/);
  assert.doesNotMatch(nginx, /\$uri\/index\.html/);
});

test('Nginx resolves the client identity from the trusted Traefik proxy boundary', () => {
  assert.match(nginx, /# Traefik proxy network real IP/);
  assert.match(nginx, /set_real_ip_from 172\.16\.0\.0\/12;/);
  assert.match(nginx, /real_ip_header CF-Connecting-IP;/);
  assert.match(nginx, /real_ip_recursive on;/);
});

test('Nginx proxies contribution submissions to the lead service with the API contract', () => {
  const contributionLocation = nginx.match(/location = \/api\/contributions\/submit\s*{([\s\S]*?)\n\s*}/)?.[1] ?? '';
  assert.match(contributionLocation, /client_max_body_size 128k;/);
  assert.match(contributionLocation, /proxy_set_header Host \$host;/);
  assert.match(contributionLocation, /proxy_set_header X-Real-IP \$remote_addr;/);
  assert.match(contributionLocation, /proxy_set_header X-Forwarded-Proto \$http_x_forwarded_proto;/);
  assert.match(contributionLocation, /proxy_set_header CF-Connecting-IP \$remote_addr;/);
  assert.match(contributionLocation, /proxy_connect_timeout 10s;/);
  assert.match(contributionLocation, /proxy_read_timeout 10s;/);
  assert.match(contributionLocation, /proxy_pass http:\/\/download-leads:8787;/);
  assert.match(nginx, /location \/api\/download-leads\/\s*{[\s\S]*?client_max_body_size 128k;/);
  assert.match(nginx, /location \^~ \/downloads\/\s*{[\s\S]*?client_max_body_size 16k;/);
  assert.doesNotMatch(nginx, /proxy_set_header CF-Connecting-IP \$http_cf_connecting_ip;/);
});

test('Nginx allows the editorial contribution body while keeping downloads bounded', () => {
  const apiLocation = nginx.match(/location \/api\/download-leads\/\s*{([\s\S]*?)\n\s*}/)?.[1] ?? '';
  const downloadsLocation = nginx.match(/location \^~ \/downloads\/\s*{([\s\S]*?)\n\s*}/)?.[1] ?? '';
  assert.match(apiLocation, /client_max_body_size 128k;/);
  assert.match(downloadsLocation, /client_max_body_size 16k;/);
});
