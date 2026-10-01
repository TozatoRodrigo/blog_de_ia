import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { classifyGeneratedPath, sourceQueue, acquirePublicationLock, releasePublicationLock, verifySnapshot, snapshotPaths, allowedEditorialPaths, validatePublicationChanges, validateEditionContents, localPathsFromStatus } from '../scripts/newsletter-preflight.mjs';

const editionText = (overrides = {}) => `---\n${Object.entries({title:'Documentos',date:'2026-10-01',seoSlug:'gemini-documentos',excerpt:'Resumo fiel',tags:['produto'],featured:true,draft:false,...overrides}).map(([key,value])=>`${key}: ${JSON.stringify(value)}`).join('\n')}\n---\nTexto.\n`;
test('added editions bind non-draft frontmatter to unique dates and public routes', () => {
  const paths=allowedEditorialPaths('2026-10-01','gemini-documentos');
  const changes=paths.map(path=>({status:'A',path}));
  const files=new Map(paths.map(path=>[path,editionText()]));
  assert.equal(validateEditionContents(changes,files)[0].en.url,'https://produtocomia.com.br/en/newsletter/gemini-documentos/');
  for(const override of [{draft:true},{date:'2026-09-30'},{seoSlug:'2026-10-01-gemini-documentos'}]) {
    const invalid=new Map(files);invalid.set(paths[0],editionText(override));assert.throws(()=>validateEditionContents(changes,invalid));
  }
  const duplicate=new Map(files);duplicate.set('src/content/newsletters/2026-10-01-another.md',editionText({seoSlug:'another'}));
  assert.throws(()=>validateEditionContents(changes,duplicate),/one edition per date/);
  const collision=new Map(files);collision.set('src/content/newsletters/2026-09-30-earlier.md',editionText({date:'2026-09-30'}));
  assert.throws(()=>validateEditionContents(changes,collision),/seoSlug collision/);
});

test('only expected ignored build outputs are generated-path exceptions', () => {
  assert.equal(classifyGeneratedPath('dist/en/newsletter/foo/index.html', true), true);
  assert.equal(classifyGeneratedPath('.astro/data-store.json', true), true);
  assert.equal(classifyGeneratedPath('public/og/newsletter/en-foo.png', true), true);
  assert.equal(classifyGeneratedPath('public/og/guides/foo.png', true), false);
  assert.equal(classifyGeneratedPath('src/pages/index.astro', true), false);
  assert.equal(classifyGeneratedPath('dist/file', false), false);
  assert.equal(classifyGeneratedPath('dist/../private-downloads/a.csv', true), false);
});

test('editorial staging allows only same dated filename in both languages', () => {
  assert.deepEqual(allowedEditorialPaths('2026-10-01', 'gemini-documentos'), [
    'src/content/newsletters/2026-10-01-gemini-documentos.md',
    'src/content/newsletters-en/2026-10-01-gemini-documentos.md',
  ]);
  assert.throws(() => allowedEditorialPaths('2026-10-01', '../config'), /slug/);
  assert.throws(() => allowedEditorialPaths('2026-02-30', 'foo'), /date/);
});

test('production daily gate accepts additions in paired collections only', () => {
  const paths = allowedEditorialPaths('2026-10-01', 'gemini-documentos');
  assert.equal(validatePublicationChanges(paths.map(path=>({status:'A',path})), 'daily').editions, 1);
  assert.throws(()=>validatePublicationChanges([{status:'M',path:paths[0]},{status:'A',path:paths[1]}], 'daily'), /additions/);
  assert.throws(()=>validatePublicationChanges([...paths.map(path=>({status:'A',path})),{status:'M',path:'src/pages/index.astro'}], 'daily'), /editorial/);
  assert.throws(()=>validatePublicationChanges([{status:'A',path:paths[0]}], 'daily'), /paired/);
});

test('setup designation cannot introduce unrelated implementation', () => {
  assert.equal(validatePublicationChanges([{status:'M',path:'scripts/deploy.sh'}], 'setup').kind, 'setup');
  assert.throws(()=>validatePublicationChanges([{status:'M',path:'services/download-leads/src/server.mjs'}], 'setup'), /setup/);
  assert.throws(()=>validatePublicationChanges([{status:'D',path:'scripts/deploy.sh'}], 'setup'), /setup/);
});

test('queue checks exactly today and next three calendar days', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'newsletter-queue-'));
  await writeFile(join(directory, 'Newsletter Programada - 01-10-2026.md'), 'source');
  const queue = await sourceQueue('2026-10-01', directory);
  assert.equal(queue.today.exists, true);
  assert.equal(queue.firstMissingFuture.date, '2026-10-02');
  assert.deepEqual(queue.future.map(row => row.date), ['2026-10-02', '2026-10-03', '2026-10-04']);
});

test('publication lock excludes another publisher and requires owner token', async () => {
  const root = await mkdtemp(join(tmpdir(), 'newsletter-lock-test-'));
  const path = join(root, 'shared-lock');
  const lock = await acquirePublicationLock(path, { owner: 'daily' });
  await assert.rejects(acquirePublicationLock(path, { owner: 'weekly' }), /publication locked/);
  await assert.rejects(releasePublicationLock(path, 'wrong-token'), /owner token/);
  assert.equal(JSON.parse(await readFile(join(path, 'owner.json'), 'utf8')).token, lock.token);
  await releasePublicationLock(path, lock.token);
  const next = await acquirePublicationLock(path, { owner: 'weekly' });
  await releasePublicationLock(path, next.token);
});

test('preexisting physical files are checked even when untracked', async () => {
  const root = await mkdtemp(join(tmpdir(), 'newsletter-preserve-'));
  await mkdir(join(root, 'src'));
  await writeFile(join(root, 'src/local.md'), 'preserve this');
  const saved = await snapshotPaths(root, ['src/local.md']);
  assert.deepEqual(await verifySnapshot(root, saved), []);
  await writeFile(join(root, 'src/local.md'), 'changed');
  assert.deepEqual(await verifySnapshot(root, saved), ['src/local.md']);
  await unlink(join(root, 'src/local.md'));
  assert.deepEqual(await verifySnapshot(root, saved), ['src/local.md']);
});

test('local inventory preserves deleted paths and both sides of porcelain renames', async () => {
  assert.deepEqual(localPathsFromStatus('R  src/new.md\0src/old.md\0 D src/deleted.md\0?? extra.md\0'),['src/new.md','src/old.md','src/deleted.md','extra.md']);
  const root=await mkdtemp(join(tmpdir(),'newsletter-deleted-'));
  const saved=await snapshotPaths(root,['deleted.md']);
  assert.equal(saved[0].kind,'missing');
  assert.deepEqual(await verifySnapshot(root,saved),[]);
  await writeFile(join(root,'deleted.md'),'resurrected');
  assert.deepEqual(await verifySnapshot(root,saved),['deleted.md']);
});
