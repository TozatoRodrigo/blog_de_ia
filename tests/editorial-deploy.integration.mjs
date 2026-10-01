// Explicit integration suite: local containers only; never part of daily validation.
import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, writeFile, readFile, copyFile, readlink, access, cp } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createInfrastructureManifest } from '../scripts/newsletter-infrastructure.mjs';

const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitFor(check) { for (let n = 0; n < 60; n++) { try { if (await check()) return; } catch {} await sleep(200); } throw new Error('integration condition timed out'); }

async function setup() {
  docker('build', '-t', 'newsletter-test-controller:local', '-f', 'tests/fixtures/editorial-deploy/Dockerfile', 'tests/fixtures/editorial-deploy');
  const root = await mkdtemp('/private/tmp/newsletter-deploy-test-');
  const suffix = root.split('-').at(-1).toLowerCase();
  const site = `newsletter-test-site-${suffix}`;
  const leads = `newsletter-test-leads-${suffix}`;
  const controller = `newsletter-test-controller-${suffix}`;
  const volume = `newsletter-test-volume-${suffix}`;
  const network = `newsletter-test-network-${suffix}`;
  const legacy = 'map $uri $newsletter_redirect { default ""; include /usr/share/nginx/html/_newsletter-redirects.map; }\nserver { listen 80; root /usr/share/nginx/html; index index.html; location /api/ { proxy_pass http://download-leads:8787; } location /downloads/ { proxy_pass http://download-leads:8787; } location / { try_files $uri $uri/ =404; } }\n';
  const next = legacy.replaceAll('/usr/share/nginx/html', '/usr/share/nginx/html/current');
  for (const directory of ['html/en', 'html/_astro', 'private-downloads', 'lead-data', 'services/download-leads/src', 'config', 'deploy']) await mkdir(join(root, directory), { recursive: true });
  const fixture = {
    '.env.download-leads': 'TEST_ONLY=fixture\n', 'lead-data/fixture.sqlite': 'persistent fixture',
    'private-downloads/matrix.csv': 'protected fixture', 'services/download-leads/src/server.mjs': 'stable fixture',
    'config/downloads.json': '{}', 'docker-compose.yml': 'unchanged fixture', 'deploy/docker-compose.yml': 'unchanged fixture',
    'nginx.conf': legacy, 'deploy/nginx.conf': next,
    'html/index.html': 'OLD release', 'html/en/index.html': 'OLD English',
    'html/_astro/old-session.js': 'console.log("old session")', 'html/_newsletter-redirects.map': '# legacy map\n',
  };
  for (const [path, body] of Object.entries(fixture)) await writeFile(join(root, path), body, path === '.env.download-leads' ? { mode: 0o600 } : undefined);
  await cp(resolve('services/download-leads'), join(root, 'services/download-leads'), { recursive: true });
  const catalog = [{ id: 'ai-risk-matrix', filename: 'matrix.csv', contentType: 'text/csv; charset=utf-8', language: 'en', labels: { 'pt-BR': 'Matriz teste', en: 'Test matrix' }, description: { 'pt-BR': 'Fixture local.', en: 'Local fixture.' }, relatedUrl: { 'pt-BR': '/guias/', en: '/en/guides/' } }];
  await writeFile(join(root, 'config/downloads.json'), JSON.stringify(catalog));
  docker('build', '-t', `newsletter-test-leads:${suffix}`, '-f', 'services/download-leads/Dockerfile', root);
  docker('volume', 'create', '--label', 'produtocomia-test=editorial-deploy', volume);
  docker('network', 'create', '--label', 'produtocomia-test=editorial-deploy', network);
  docker('run', '-d', '--name', controller, '--label', 'produtocomia-test=editorial-deploy', '--mount', `type=volume,src=${volume},dst=/fixture`, '--mount', 'type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock', 'newsletter-test-controller:local', 'sleep', 'infinity');
  docker('cp', `${root}/.`, `${controller}:/fixture/base`);
  docker('exec', controller, 'mkdir', '-p', '/fixture/tools');
  for (const [file, target] of [['scripts/lib/editorial-deploy-remote.sh','remote.sh'],['scripts/newsletter-infrastructure.mjs','newsletter-infrastructure.mjs']]) docker('cp', resolve(file), `${controller}:/fixture/tools/${target}`);
  docker('exec', controller, 'chmod', '777', '/fixture/base/lead-data');
  const mounted = docker('volume', 'inspect', '--format', '{{.Mountpoint}}', volume);
  const env = ['NODE_ENV=test', 'PORT=8787', 'DATABASE_PATH=/data/leads.sqlite', 'DOWNLOADS_DIR=/app/downloads', 'DOWNLOAD_CATALOG_PATH=/app/config/downloads.json', 'ALLOWED_ORIGIN=https://produtocomia.com.br', `COOKIE_SECRET=${'s'.repeat(64)}`, 'TURNSTILE_SITE_KEY=1x00000000000000000000AA', 'TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA', 'RESEND_FROM=Test <test@example.com>', 'LEAD_NOTIFICATION_TO=test@example.com', 'NOTIFICATION_MODE=log'];
  docker('run', '-d', '--name', leads, '--label', 'produtocomia-test=editorial-deploy', '--network', network, '--network-alias', 'download-leads', ...env.flatMap(value => ['-e', value]), '--health-interval', '1s', '--mount', `type=bind,src=${mounted}/base/lead-data,dst=/data`, '--mount', `type=bind,src=${mounted}/base/private-downloads,dst=/app/downloads,readonly`, `newsletter-test-leads:${suffix}`);
  docker('run', '-d', '--name', site, '--label', 'produtocomia-test=editorial-deploy', '--network', network, '-p', '127.0.0.1::80', '--mount', `type=bind,src=${mounted}/base/html,dst=/usr/share/nginx/html,readonly`, '--mount', `type=bind,src=${mounted}/base/nginx.conf,dst=/etc/nginx/conf.d/default.conf,readonly`, 'nginx:alpine');
  const origin = `http://${docker('port', site, '80/tcp')}`;
  await waitFor(() => docker('inspect', '--format', '{{.State.Health.Status}}', leads) === 'healthy');
  await waitFor(async () => (await fetch(origin)).ok);
  const identities = () => [site, leads].map(name => docker('inspect', '--format', '{{.Id}} {{.State.StartedAt}}', name));
  return { root, site, leads, controller, volume, network, origin, identities, before: identities(), next };
}

async function release(ctx, stamp, body, invalidMap = false) {
  const input = await mkdtemp('/private/tmp/newsletter-deploy-input-');
  const dist = join(input, 'dist');
  await mkdir(join(dist, 'en'), { recursive: true });
  for (const [path, data] of Object.entries({ 'index.html': body, 'en/index.html': `${body} English`, 'llms-full.txt': '# fixture corpus', '_newsletter-redirects.map': invalidMap ? 'bad nginx map syntax;\n' : '# redirects\n' })) await writeFile(join(dist, path), data);
  execFileSync('tar', ['-C', dist, '-czf', join(input, 'site.tar.gz'), '.']);
  const siteSha = createHash('sha256').update(await readFile(join(input, 'site.tar.gz'))).digest('hex');
  await writeFile(join(input, 'infrastructure.json'), JSON.stringify(await createInfrastructureManifest(ctx.root)));
  const active = JSON.parse(docker('exec','-e','EDITORIAL_DEPLOY_TEST=1','-e','EDITORIAL_DEPLOY_TEST_BASE=/fixture/base','-e',`EDITORIAL_DEPLOY_TEST_SITE_CONTAINER=${ctx.site}`,'-e',`EDITORIAL_DEPLOY_TEST_LEADS_CONTAINER=${ctx.leads}`,'-e',`EDITORIAL_DEPLOY_TEST_INPUT=/fixture/input-${stamp}`,ctx.controller,'sh','/fixture/tools/remote.sh','inspect',stamp,''));
  await writeFile(join(input, 'release.json'), JSON.stringify({ kind:active.legacy?'setup':'daily', gitSha:createHash('sha1').update(stamp).digest('hex'), baseSha:active.gitSha||'0'.repeat(40) }));
  await writeFile(join(input, 'baseline.json'), '{}');
  await copyFile(resolve('scripts/newsletter-infrastructure.mjs'), join(input, 'newsletter-infrastructure.mjs'));
  await writeFile(join(input, 'nginx.conf'), ctx.next);
  const destination = `/fixture/input-${stamp}`;
  docker('cp', `${input}/.`, `${ctx.controller}:${destination}`);
  const action = command => spawnSync('docker', ['exec', '-e', 'EDITORIAL_DEPLOY_TEST=1', '-e', 'EDITORIAL_DEPLOY_TEST_BASE=/fixture/base', '-e', `EDITORIAL_DEPLOY_TEST_SITE_CONTAINER=${ctx.site}`, '-e', `EDITORIAL_DEPLOY_TEST_LEADS_CONTAINER=${ctx.leads}`, '-e', `EDITORIAL_DEPLOY_TEST_INPUT=${destination}`, ctx.controller, 'sh', '/fixture/tools/remote.sh', command, stamp, siteSha], { encoding: 'utf8' });
  return { input, action, stamp };
}
function success(result) { assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`); }

async function dispose(ctx) {
  // These uniquely named fixture containers are the only resources removed.
  for (const name of [ctx.site, ctx.leads, ctx.controller]) {
    assert.equal(docker('inspect', '--format', '{{index .Config.Labels "produtocomia-test"}}', name), 'editorial-deploy');
    docker('rm', '-f', name);
  }
  docker('network', 'rm', ctx.network);
}

test('two atomic static releases preserve actual container identities and private fixtures; rollback restores old release', async () => {
  const ctx = await setup();
  try {
    const checkService = async () => {
      assert.deepEqual(await fetch(`${ctx.origin}/api/download-leads/health`).then(r=>r.json()),{status:'ok'});
      const form=await fetch(`${ctx.origin}/downloads/matrix.csv`);assert.equal(form.status,200);assert.match(form.headers.get('cache-control'),/no-store/);assert.match(await form.text(),/type="email"/);
      const rejected=await fetch(`${ctx.origin}/api/contributions/submit`,{method:'POST',headers:{origin:'https://produtocomia.com.br','content-type':'application/json'},body:'{'});assert.equal(rejected.status,400);
    };
    await checkService();
    const first = await release(ctx, 'test-one', 'FIRST release');
    success(first.action('prepare'));
    assert.equal(await fetch(ctx.origin).then(r => r.text()), 'OLD release');
    success(first.action('activate'));
    await waitFor(async () => await fetch(ctx.origin).then(r => r.text()) === 'FIRST release');
    success(first.action('finalize'));
    assert.deepEqual(ctx.identities(), ctx.before);
    await checkService();
    assert.equal(await fetch(`${ctx.origin}/_astro/old-session.js`).then(r => r.text()), 'console.log("old session")');
    const second = await release(ctx, 'test-two', 'SECOND release');
    success(second.action('prepare'));
    success(second.action('activate'));
    try { await waitFor(async () => await fetch(ctx.origin).then(r => r.text()) === 'SECOND release'); } catch (error) {
      console.error(JSON.stringify({origin:ctx.origin,body:await fetch(ctx.origin).then(r=>r.text()), hostPointer:docker('exec',ctx.controller,'readlink','/fixture/base/html/current'),containerPointer:docker('exec',ctx.site,'readlink','/usr/share/nginx/html/current'), containerBody:docker('exec',ctx.site,'cat','/usr/share/nginx/html/current/index.html')}));
      console.error(docker('exec',ctx.site,'nginx','-T')); throw error;
    }
    success(second.action('rollback'));
    await waitFor(async () => await fetch(ctx.origin).then(r => r.text()) === 'FIRST release');
    assert.equal(docker('exec',ctx.controller,'readlink','/fixture/base/html/current'), '.releases/test-one');
    assert.deepEqual(ctx.identities(), ctx.before);
    await checkService();
    assert.equal(docker('exec',ctx.controller,'cat','/fixture/base/private-downloads/matrix.csv'), 'protected fixture');
    assert.equal(docker('exec',ctx.controller,'cat','/fixture/base/lead-data/fixture.sqlite'), 'persistent fixture');
    assert.equal(docker('exec',ctx.controller,'cat','/fixture/base/.env.download-leads'), 'TEST_ONLY=fixture');
    assert.notEqual(spawnSync('docker',['exec',ctx.controller,'test','-d','/fixture/base/.publication-lock']).status,0);
    const invalid = await release(ctx, 'test-invalid', 'INVALID candidate', true);
    success(invalid.action('prepare'));
    assert.notEqual(invalid.action('activate').status, 0);
    success(invalid.action('rollback')); // idempotent confirmation after automatic remote trap
    await waitFor(async () => await fetch(ctx.origin).then(r => r.text()) === 'FIRST release');
    assert.deepEqual(ctx.identities(), ctx.before);
    await checkService();
    assert.equal(docker('exec',ctx.controller,'cat','/fixture/base/releases/test-invalid/state'), 'rolled-back');
    console.log(JSON.stringify({ evidence: ctx.root, linuxVolume:ctx.volume, before: ctx.before, after: ctx.identities(), rollback: 'verified' }));
  } finally { await dispose(ctx); }
});
