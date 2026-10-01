import { createHash, randomUUID } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, readlink, rmdir, unlink, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:net';
import { createRequire } from 'node:module';

// Astro declares this parser; resolve through Astro rather than an accidental hoisted dependency.
const require = createRequire(import.meta.url);
const { load: parseYaml } = createRequire(require.resolve('astro/package.json'))('js-yaml');

export const CANONICAL = '/Users/rodrigodiastozato/Developer/Blog_de_IA';
export const SOURCE_DIRECTORY = '/Users/rodrigodiastozato/Downloads/AgentWorkspace/09 Linkedin Tozato/Newsletter - Programado';
export const SHARED_LOCK = '/private/tmp/produtocomia-publication.lock';
const hash = value => createHash('sha256').update(value).digest('hex');
const git = (cwd, ...args) => { const value = execFileSync('git', args, { cwd, encoding: 'utf8' }); return args.includes('-z') ? value : value.trim(); };

function checkedDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) !== value) throw new Error('invalid date');
  return value;
}

export function allowedEditorialPaths(date, slug) {
  checkedDate(date);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('invalid slug');
  return ['newsletters', 'newsletters-en'].map(collection => `src/content/${collection}/${date}-${slug}.md`);
}

const SETUP_PATHS = new Set([
  'AGENT_NEWSLETTER_TASK.md', 'docs/operations/daily-newsletter-runbook.md', 'deploy/nginx.conf',
  'scripts/deploy.sh', 'scripts/newsletter-preflight.mjs', 'scripts/newsletter-infrastructure.mjs',
  'scripts/newsletter-continuity.mjs', 'scripts/lib/newsletter-continuity.mjs', 'scripts/lib/editorial-deploy-remote.sh',
  'tests/deploy-contract.test.mjs', 'tests/editorial-deploy.test.mjs', 'tests/editorial-deploy.integration.mjs',
  'tests/newsletter-preflight.test.mjs', 'tests/newsletter-infrastructure.test.mjs', 'tests/newsletter-continuity.test.mjs',
  'tests/fixtures/editorial-deploy/Dockerfile',
]);

export function validatePublicationChanges(changes, kind = 'daily') {
  if (!changes.length) throw new Error('publication has no changes');
  if (kind === 'setup') {
    if (changes.some(row => !['A','M'].includes(row.status) || !SETUP_PATHS.has(row.path))) throw new Error('unreviewed setup paths');
    return { kind, files:changes.length };
  }
  if (kind !== 'daily') throw new Error('unsupported publication kind');
  const pairs = new Map();
  for (const row of changes) {
    const match = row.path.match(/^src\/content\/(newsletters|newsletters-en)\/(\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.md)$/);
    if (!match) throw new Error(`non-editorial daily path: ${row.path}`);
    if (row.status !== 'A') throw new Error('daily publication permits additions only');
    checkedDate(match[2].slice(0,10));
    const languages=pairs.get(match[2])??new Set();languages.add(match[1]);pairs.set(match[2],languages);
  }
  if ([...pairs.values()].some(languages=>languages.size!==2)) throw new Error('daily files must be paired');
  return { kind, editions:pairs.size, files:changes.length };
}

export function validateEditionContents(changes, files) {
  validatePublicationChanges(changes, 'daily');
  const parsed=new Map();
  for (const [path,text] of files) {
    const frontmatter=text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if(!frontmatter) throw new Error(`missing frontmatter: ${path}`);
    parsed.set(path,parseYaml(frontmatter[1]));
  }
  const editions=new Map();
  for(const {path} of changes) {
    const data=parsed.get(path);
    const [,collection,file]=path.match(/^src\/content\/(newsletters|newsletters-en)\/(.+\.md)$/);
    const date=file.slice(0,10);
    if(!data || data.date!==date || data.draft!==false || typeof data.featured!=='boolean' || !Array.isArray(data.tags) || data.tags.some(tag=>typeof tag!=='string') || !['title','excerpt','seoSlug'].every(key=>typeof data[key]==='string'&&data[key].trim())) throw new Error(`invalid publication frontmatter/date/draft: ${path}`);
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.seoSlug)||/^\d{4}-\d{2}-\d{2}-/.test(data.seoSlug)) throw new Error(`invalid seoSlug: ${path}`);
    const peers=[...parsed].filter(([other])=>other.startsWith(`src/content/${collection}/`));
    if(peers.filter(([other,value])=>other.split('/').at(-1).startsWith(`${date}-`)||value.date===date).length!==1) throw new Error(`one edition per date required: ${date} ${collection}`);
    if(peers.some(([other,value])=>other!==path&&value.seoSlug===data.seoSlug)) throw new Error(`seoSlug collision: ${path}`);
    const row=editions.get(file)??{date,file};
    const language=collection==='newsletters'?'pt':'en';
    row[language]={seoSlug:data.seoSlug,url:`https://produtocomia.com.br/${language==='en'?'en/':''}newsletter/${data.seoSlug}/`};
    editions.set(file,row);
  }
  return [...editions.values()];
}

export function classifyGeneratedPath(path, ignored) {
  if (!ignored || path.split('/').some(part => part === '..' || part === '.')) return false;
  return path.startsWith('dist/') || path.startsWith('.astro/') || /^public\/og\/newsletter\/[^/]+\.png$/.test(path);
}

export async function sourceQueue(date, directory = SOURCE_DIRECTORY) {
  checkedDate(date);
  const rows = Array.from({ length: 4 }, (_, offset) => {
    const day = new Date(`${date}T12:00:00Z`);
    day.setUTCDate(day.getUTCDate() + offset);
    const iso = day.toISOString().slice(0, 10);
    const [year, month, dom] = iso.split('-');
    const path = join(directory, `Newsletter Programada - ${dom}-${month}-${year}.md`);
    return { date: iso, path, exists: existsSync(path) };
  });
  return { today: rows[0], future: rows.slice(1), firstMissingFuture: rows.slice(1).find(row => !row.exists) ?? null };
}

export async function snapshotPaths(root, paths) {
  return Promise.all(paths.map(async path => {
    if (resolve(root, path) === root || !resolve(root, path).startsWith(`${resolve(root)}${sep}`)) throw new Error('snapshot path escapes root');
    const file = join(root, path);
    let stat;
    try { stat = await lstat(file); } catch(error) { if(error.code==='ENOENT') return {path,kind:'missing',sha256:null}; throw error; }
    return { path, kind: stat.isSymbolicLink() ? 'symlink' : 'file', sha256: hash(stat.isSymbolicLink() ? await readlink(file) : await readFile(file)) };
  }));
}

export function localPathsFromStatus(status) {
  const records=status.split('\0');const paths=[];
  for(let index=0;index<records.length;index++) {
    const row=records[index];if(!row)continue;
    paths.push(row.slice(3));
    if(/[RC]/.test(row.slice(0,2))) { const from=records[++index];if(!from)throw new Error('invalid porcelain rename');paths.push(from); }
  }
  return [...new Set(paths)];
}

export async function verifySnapshot(root, snapshot) {
  const changed = [];
  for (const saved of snapshot) {
    try {
      const [current] = await snapshotPaths(root, [saved.path]);
      if (current.sha256 !== saved.sha256 || current.kind !== saved.kind) changed.push(saved.path);
    } catch { changed.push(saved.path); }
  }
  return changed;
}

export async function acquirePublicationLock(path = SHARED_LOCK, details = {}) {
  try { await mkdir(path, { mode: 0o700 }); }
  catch (error) { if (error.code === 'EEXIST') throw new Error(`publication locked: ${path}; inspect owner.json, never expire automatically`); throw error; }
  const owner = { ...details, token: randomUUID(), pid: process.pid, parentPid: process.ppid, createdAt: new Date().toISOString() };
  await writeFile(join(path, 'owner.json'), `${JSON.stringify(owner, null, 2)}\n`, { mode: 0o600, flag: 'wx' });
  return owner;
}

export async function releasePublicationLock(path = SHARED_LOCK, token) {
  const owner = JSON.parse(await readFile(join(path, 'owner.json'), 'utf8'));
  if (!token || token !== owner.token) throw new Error('publication lock owner token mismatch');
  await unlink(join(path, 'owner.json'));
  await rmdir(path);
}

async function physicalFiles(root, directory = root) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    if (['.git', '.worktrees', 'node_modules'].includes(item.name)) continue;
    const full = join(directory, item.name);
    if (item.isDirectory()) files.push(...await physicalFiles(root, full));
    else files.push(relative(root, full));
  }
  return files.sort();
}

async function socketPermission() {
  const server = createServer();
  await new Promise((accept, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', accept); });
  await new Promise((accept, reject) => server.close(error => error ? reject(error) : accept()));
}

async function inspect(date, output) {
  if (git(CANONICAL, 'branch', '--show-current') !== 'main') throw new Error('canonical branch must be main');
  const queue = await sourceQueue(date);
  const status = git(CANONICAL, 'status', '--porcelain=v1', '-z', '--untracked-files=all');
  const localPaths = localPathsFromStatus(status);
  const report = {
    version: 1, date, canonical: CANONICAL, canonicalHead: git(CANONICAL, 'rev-parse', 'HEAD'),
    status, localPaths: await snapshotPaths(CANONICAL, localPaths), queue,
    createdAt: new Date().toISOString(),
  };
  if (queue.today.exists) await socketPermission();
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  if (!queue.today.exists) { console.log(JSON.stringify({ status: 'skipped-source-absent', output, queue })); return; }
  console.log(JSON.stringify({ status: 'preflight-ok', output, preservedPaths: localPaths.length, queue }));
}

async function captureValidation(output) {
  const root = process.cwd();
  const tracked = git(root, 'ls-files', '-z').split('\0').filter(Boolean);
  const files = await physicalFiles(root);
  await writeFile(output, `${JSON.stringify({ root, head: git(root, 'rev-parse', 'HEAD'), tracked, files: await snapshotPaths(root, files) }, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
}

async function verifyValidation(input, date, slug) {
  const saved = JSON.parse(await readFile(input, 'utf8'));
  if (resolve(saved.root) !== process.cwd() || git(saved.root, 'rev-parse', 'HEAD') !== saved.head) throw new Error('validation snapshot root/HEAD mismatch');
  const allowed = new Set(date ? allowedEditorialPaths(date, slug) : []);
  const changed = await verifySnapshot(saved.root, saved.files);
  const before = new Set(saved.files.map(row => row.path));
  const unexpected = changed.filter(path => !allowed.has(path));
  for (const path of await physicalFiles(saved.root)) {
    if (before.has(path) || allowed.has(path)) continue;
    let ignored = false;
    try { git(saved.root, 'check-ignore', '--', path); ignored = true; } catch {}
    if (saved.tracked.includes(path) || !classifyGeneratedPath(path, ignored)) unexpected.push(path);
  }
  const gitPaths = [...git(saved.root, 'diff', '--name-only').split('\n'), ...git(saved.root, 'diff', '--cached', '--name-only').split('\n')].filter(Boolean);
  unexpected.push(...gitPaths.filter(path => !allowed.has(path)));
  if (unexpected.length) throw new Error(`unauthorized validation paths: ${[...new Set(unexpected)].join(', ')}`);
  console.log(JSON.stringify({ status: 'validation-paths-ok', allowed: [...allowed] }));
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'inspect' && args.length === 2) await inspect(...args);
  else if (command === 'lock' && args.length === 1) console.log(JSON.stringify(await acquirePublicationLock(SHARED_LOCK, { owner: args[0] })));
  else if (command === 'unlock' && args.length === 1) await releasePublicationLock(SHARED_LOCK, args[0]);
  else if (command === 'snapshot-validation' && args.length === 1) await captureValidation(args[0]);
  else if (command === 'verify-validation' && args.length === 3) await verifyValidation(...args);
  else if (command === 'verify-build' && args.length === 1) await verifyValidation(args[0]);
  else if (command === 'publication-contract' && args.length === 3) {
    const [kind, base, head] = args;
    if (!/^[a-f0-9]{40}$/.test(base) || !/^[a-f0-9]{40}$/.test(head)) throw new Error('invalid publication SHA');
    git(process.cwd(), 'merge-base', '--is-ancestor', base, head);
    const changes=git(process.cwd(), 'diff', '--name-status', base, head).split('\n').filter(Boolean).map(row=>{const [status,path]=row.split('\t');return {status,path};});
    const result=validatePublicationChanges(changes, kind);
    let editionsRequired=[];
    if (kind==='daily') {
      const current=git(process.cwd(), 'diff', '--name-status', `${head}^`, head).split('\n').filter(Boolean).map(row=>{const [status,path]=row.split('\t');return {status,path};});
      if (validatePublicationChanges(current, 'daily').editions!==1) throw new Error('HEAD must add exactly one paired edition');
      const paths=git(process.cwd(),'ls-tree','-r','--name-only',head,'src/content/newsletters','src/content/newsletters-en').split('\n').filter(path=>path.endsWith('.md'));
      const files=new Map(paths.map(path=>[path,git(process.cwd(),'show',`${head}:${path}`)]));
      editionsRequired=validateEditionContents(changes,files);
    }
    console.log(JSON.stringify({...result,base,head,editionsRequired}));
  }
  else if (command === 'verify-local' && args.length === 1) {
    const report = JSON.parse(await readFile(args[0], 'utf8'));
    const changed = await verifySnapshot(CANONICAL, report.localPaths);
    if (changed.length) throw new Error(`canonical local paths changed: ${changed.join(', ')}`);
    if (git(CANONICAL, 'rev-parse', 'HEAD') !== report.canonicalHead || git(CANONICAL, 'status', '--porcelain=v1', '-z', '--untracked-files=all') !== report.status) throw new Error('canonical HEAD or status changed');
    console.log(JSON.stringify({ status: 'canonical-preserved', paths: report.localPaths.length }));
  } else if (command === 'stage-check' && args.length === 2) {
    const allowed = allowedEditorialPaths(...args);
    const staged = git(process.cwd(), 'diff', '--cached', '--name-only').split('\n').filter(Boolean).sort();
    if (JSON.stringify(staged) !== JSON.stringify(allowed.sort())) throw new Error(`staged allowlist mismatch: ${staged.join(', ')}`);
    git(process.cwd(), 'diff', '--cached', '--check');
    console.log(JSON.stringify({ status: 'staged-allowlist-ok', staged }));
  } else throw new Error('Usage: newsletter-preflight.mjs inspect DATE OUTPUT | lock OWNER | unlock TOKEN | snapshot-validation OUTPUT | verify-validation INPUT DATE SLUG | verify-local INPUT | stage-check DATE SLUG');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
