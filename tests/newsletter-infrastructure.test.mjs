import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { createInfrastructureManifest, compareInfrastructure, expectedRuntimeFiles, assertRuntimeInventory } from '../scripts/newsletter-infrastructure.mjs';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'newsletter-infra-'));
  for (const dir of ['deploy', 'config', 'private-downloads', 'services/download-leads/src']) await mkdir(join(root, dir), { recursive: true });
  for (const [path, data] of Object.entries({
    'deploy/nginx.conf': 'root /usr/share/nginx/html/current;\ninclude /usr/share/nginx/html/current/_newsletter-redirects.map;\n',
    'deploy/docker-compose.yml': 'services: stable', 'config/downloads.json': '{}',
    'private-downloads/matrix.csv': 'private', 'services/download-leads/src/server.mjs': 'stable service',
  })) await writeFile(join(root, path), data);
  await writeFile(join(root, 'nginx.conf'), 'root /usr/share/nginx/html;\ninclude /usr/share/nginx/html/_newsletter-redirects.map;\n');
  await writeFile(join(root, 'docker-compose.yml'), 'services: stable');
  return root;
}

test('only the reviewed Nginx root migration is accepted against actual production', async () => {
  const root = await fixture();
  const manifest = await createInfrastructureManifest(root);
  const result = await compareInfrastructure(root, manifest);
  assert.equal(result.legacyNginx, true);
  await writeFile(join(root, 'nginx.conf'), 'unreviewed production change');
  await assert.rejects(compareInfrastructure(root, manifest), /nginx.conf/);
});

test('a private file or service mismatch blocks editorial publication', async () => {
  const root = await fixture();
  const manifest = await createInfrastructureManifest(root);
  await writeFile(join(root, 'private-downloads/matrix.csv'), 'changed');
  await assert.rejects(compareInfrastructure(root, manifest), /private-downloads\/matrix.csv/);
});

test('extra production files cannot disappear silently', async () => {
  const root = await fixture();
  const manifest = await createInfrastructureManifest(root);
  await writeFile(join(root, 'private-downloads/additional.csv'), 'must preserve');
  await assert.rejects(compareInfrastructure(root, manifest), /additional.csv/);
});

test('runtime image and mounted private files must match candidate independently of host files', async () => {
  const manifest = await createInfrastructureManifest(await fixture());
  const expected = expectedRuntimeFiles(manifest);
  assert.ok(expected.some(row => row.path === '/app/src/server.mjs'));
  assert.ok(expected.some(row => row.path === '/app/config/downloads.json'));
  assert.ok(expected.some(row => row.path === '/app/downloads/matrix.csv'));
  assert.equal(assertRuntimeInventory(manifest, expected), true);
  assert.throws(() => assertRuntimeInventory(manifest, expected.map(row => row.path === '/app/src/server.mjs' ? {...row, sha256:'different'} : row)), /runtime/);
  assert.throws(() => assertRuntimeInventory(manifest, [...expected,{path:'/app/src/unreviewed.mjs',sha256:'other'}]), /runtime/);
});
