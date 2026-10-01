import { createHash } from 'node:crypto';
import { lstat, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const hash = data => createHash('sha256').update(data).digest('hex');
const roots = ['services/download-leads', 'private-downloads'];
async function listFiles(root, directory) {
  const paths = [];
  for (const item of await readdir(join(root, directory), { withFileTypes: true })) {
    if (item.name === 'node_modules' || item.name === '.DS_Store') continue;
    const path = `${directory}/${item.name}`;
    if (item.isSymbolicLink()) throw new Error(`infrastructure symlink is not allowed: ${path}`);
    if (item.isDirectory()) paths.push(...await listFiles(root, path));
    else if (item.isFile()) paths.push(path);
    else throw new Error(`unsupported infrastructure file: ${path}`);
  }
  return paths.sort();
}

export async function createInfrastructureManifest(root) {
  const paths = ['config/downloads.json'];
  for (const directory of roots) paths.push(...await listFiles(root, directory));
  const files = [];
  for (const path of paths.sort()) files.push({ path, sha256: hash(await readFile(join(root, path))) });
  files.push({ path: 'docker-compose.yml', sha256: hash(await readFile(join(root, 'deploy/docker-compose.yml'))) });
  const nginx = await readFile(join(root, 'deploy/nginx.conf'), 'utf8');
  const legacy = nginx.replaceAll('/usr/share/nginx/html/current', '/usr/share/nginx/html');
  const result = { version: 1, files: files.sort((a, b) => a.path.localeCompare(b.path)), nginx: { sha256: hash(nginx), legacySha256: hash(legacy) } };
  return { ...result, fingerprint: hash(JSON.stringify(result)) };
}

export async function compareInfrastructure(root, manifest) {
  if (manifest.version !== 1 || !Array.isArray(manifest.files) || !manifest.nginx) throw new Error('invalid infrastructure manifest');
  const actualPaths = ['config/downloads.json', 'docker-compose.yml'];
  for (const directory of roots) actualPaths.push(...await listFiles(root, directory));
  const expectedPaths = new Set(manifest.files.map(row => row.path));
  const errors = actualPaths.filter(path => !expectedPaths.has(path));
  for (const row of manifest.files) {
    if (!/^(?:services\/download-leads\/|private-downloads\/|config\/downloads\.json$|docker-compose\.yml$)/.test(row.path) || row.path.split('/').includes('..')) throw new Error('invalid infrastructure path');
    try {
      if ((await lstat(join(root, row.path))).isSymbolicLink() || hash(await readFile(join(root, row.path))) !== row.sha256) errors.push(row.path);
    } catch { errors.push(row.path); }
  }
  const nginxPath = join(root, 'nginx.conf');
  const nginxHash = hash(await readFile(nginxPath));
  if ((await lstat(nginxPath)).isSymbolicLink() || ![manifest.nginx.sha256, manifest.nginx.legacySha256].includes(nginxHash)) errors.push('nginx.conf');
  if (errors.length) throw new Error(`production infrastructure differs; editorial deploy blocked: ${[...new Set(errors)].sort().join(', ')}`);
  return { status: 'infrastructure-preserved', fingerprint: manifest.fingerprint, legacyNginx: nginxHash !== manifest.nginx.sha256 };
}

export function expectedRuntimeFiles(manifest) {
  return manifest.files.flatMap(row => {
    const path = row.path.startsWith('services/download-leads/src/') ? row.path.replace('services/download-leads/', '/app/')
      : row.path === 'services/download-leads/package.json' ? '/app/package.json'
      : row.path === 'config/downloads.json' ? '/app/config/downloads.json'
      : row.path.startsWith('private-downloads/') ? row.path.replace('private-downloads/', '/app/downloads/') : null;
    return path ? [{ path, sha256: row.sha256 }] : [];
  }).sort((a, b) => a.path.localeCompare(b.path));
}

export function assertRuntimeInventory(manifest, actual) {
  const expected = expectedRuntimeFiles(manifest);
  const rows = actual.map(row => ({path:row.path, sha256:row.sha256})).sort((a,b) => a.path.localeCompare(b.path));
  if (JSON.stringify(rows) !== JSON.stringify(expected)) throw new Error('running lead service runtime files differ from candidate; editorial deploy blocked');
  return true;
}

function runtimeInventory(container) {
  const code = `const fs=require('fs'),crypto=require('crypto');const rows=[];function add(path){const s=fs.lstatSync(path);if(s.isSymbolicLink())throw Error('runtime symlink');if(s.isDirectory()){for(const name of fs.readdirSync(path).sort())add(path+'/'+name);}else if(s.isFile())rows.push({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')});else throw Error('runtime special file');}for(const path of ['/app/src','/app/package.json','/app/config/downloads.json','/app/downloads'])add(path);console.log(JSON.stringify(rows));`;
  return JSON.parse(execFileSync('docker', ['exec', container, 'node', '-e', code], {encoding:'utf8'}));
}

async function main() {
  const [command, root, file, container] = process.argv.slice(2);
  if (!root || !file) throw new Error('Usage: newsletter-infrastructure.mjs manifest REPO OUTPUT | compare PRODUCTION MANIFEST');
  if (command === 'manifest') await writeFile(file, `${JSON.stringify(await createInfrastructureManifest(resolve(root)), null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  else if (command === 'compare') console.log(JSON.stringify(await compareInfrastructure(resolve(root), JSON.parse(await readFile(file, 'utf8')))));
  else if (command === 'runtime' && container) {
    const manifest = JSON.parse(await readFile(file, 'utf8'));
    await compareInfrastructure(resolve(root), manifest);
    const rows = runtimeInventory(container);
    assertRuntimeInventory(manifest, rows);
    console.log(JSON.stringify({status:'running-service-preserved',container,files:rows.length,fingerprint:manifest.fingerprint}));
  }
  else throw new Error('invalid infrastructure command');
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
