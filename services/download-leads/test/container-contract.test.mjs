import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../../../', import.meta.url);

async function text(pathname) {
  return readFile(new URL(pathname, root), 'utf8');
}

test('container runs the lead service as a non-root Node 24 process', async () => {
  const dockerfile = await text('services/download-leads/Dockerfile');
  assert.match(dockerfile, /^FROM node:24-alpine$/m);
  assert.match(dockerfile, /^USER node$/m);
  assert.match(dockerfile, /^EXPOSE 8787$/m);
  assert.match(dockerfile, /HEALTHCHECK[\s\S]*\/api\/download-leads\/health/);
  assert.match(dockerfile, /^CMD \["node", "src\/server\.mjs"\]$/m);
});

test('compose isolates data, files, secrets and container privileges', async () => {
  const compose = await text('deploy/docker-compose.yml');
  assert.match(compose, /download-leads:/);
  assert.match(compose, /env_file:\s*\n\s*- \.env\.download-leads/);
  assert.match(compose, /\.\/lead-data:\/data/);
  assert.match(compose, /\.\/private-downloads:\/app\/downloads:ro/);
  assert.match(compose, /read_only: true/);
  assert.match(compose, /tmpfs:\s*\n\s*- \/tmp/);
  assert.match(compose, /no-new-privileges:true/);
  assert.match(compose, /cap_drop:\s*\n\s*- ALL/);
  assert.match(compose, /condition: service_healthy/);
  assert.match(compose, /restart: unless-stopped/);
});

test('nginx proxies protected paths with bounded requests and Turnstile CSP', async () => {
  const nginx = await text('deploy/nginx.conf');
  assert.match(nginx, /location \/api\/download-leads\/\s*{[\s\S]*?proxy_pass http:\/\/download-leads:8787/);
  const downloadsLocation = nginx.match(/location \^~ \/downloads\/\s*{([\s\S]*?)\n\s*}/)?.[1] ?? '';
  assert.match(downloadsLocation, /proxy_pass http:\/\/download-leads:8787/);
  assert.doesNotMatch(downloadsLocation, /try_files/);
  assert.match(nginx, /client_max_body_size 16k/);
  assert.match(nginx, /proxy_connect_timeout 10s/);
  assert.match(nginx, /proxy_read_timeout 10s/);
  assert.match(nginx, /script-src[^;]*https:\/\/challenges\.cloudflare\.com/);
  assert.match(nginx, /connect-src[^;]*https:\/\/challenges\.cloudflare\.com/);
  assert.match(nginx, /frame-src[^;]*https:\/\/challenges\.cloudflare\.com/);
});

test('environment example documents production variables without working secrets', async () => {
  const env = await text('deploy/download-leads.env.example');
  for (const name of [
    'DATABASE_PATH', 'DOWNLOADS_DIR', 'DOWNLOAD_CATALOG_PATH', 'ALLOWED_ORIGIN',
    'COOKIE_SECRET', 'TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY', 'RESEND_API_KEY',
    'RESEND_FROM', 'LEAD_NOTIFICATION_TO', 'NOTIFICATION_MODE', 'PRIVACY_VERSION',
    'RETENTION_DAYS', 'SESSION_DAYS', 'AUTHORIZATION_SECONDS', 'MAX_BODY_BYTES',
  ]) {
    assert.match(env, new RegExp(`^${name}=.+$`, 'm'));
  }
  assert.match(env, /^NOTIFICATION_MODE=resend$/m);
  assert.match(env, /^LEAD_NOTIFICATION_TO=rodrigo\.tozato@icloud\.com$/m);
  assert.doesNotMatch(env, /(re_[A-Za-z0-9]{20,}|0x4AAAA[A-Za-z0-9_-]+|sk-[A-Za-z0-9]{20,})/);
});
