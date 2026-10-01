import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { captureManifest, validateCandidate, verifyManifest, expectedCandidateManifest, verifyEditions, normalizeResourceUrl } from '../scripts/lib/newsletter-continuity.mjs';

const origin = 'https://fixture.example';
const article = '<html lang="pt-BR"><head><title>Old article</title></head><body><main><article><h1>Old article</h1><div class="article-body"><p>Original editorial argument, which must remain available.</p><time>Updated today</time></div></article></main></body></html>';
const form = '<html><body><main><h1>Contribute</h1><form method="post" action="/api/contributions/submit" data-contribution-form><input name="email" type="email" required><textarea name="content" required></textarea><input name="privacyVersion" type="hidden" value="2026-09-21"><div data-turnstile data-action="contribution_submit"></div></form><a data-contact-direct="true" href="mailto:editor@example.com">Contact</a></main></body></html>';
const index = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://fixture.example/child.xml</loc></sitemap></sitemapindex>';
const child = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://fixture.example/old/</loc></url><url><loc>https://fixture.example/contribua/</loc></url></urlset>';
const initial = {
  '/sitemap-index.xml': [200, index, 'application/xml'], '/child.xml': [200, child, 'application/xml'],
  '/': [200, '<html><body><main><h1>Daily index</h1><a href="/old/">Old</a><a href="/downloads/matrix.csv">Download</a></main><script type="module" src="/arena/assets/main.js"></script></body></html>', 'text/html'],
  '/old/': [200, article, 'text/html'], '/contribua/': [200, form, 'text/html'],
  '/arena/assets/main.js': [200, 'import "./chunk.js"; fetch("/api/contributions/submit", {method:"POST"});', 'application/javascript'],
  '/arena/assets/chunk.js': [200, 'export const answer = 42;', 'application/javascript'],
  '/downloads/matrix.csv': [200, '<html><body><main><form method="post" action="/api/download-leads/register-form"><input name="email" type="email" required></form></main></body></html>', 'text/html'],
  'POST /api/contributions/submit': [400, '{"error":"invalid_submission"}', 'application/json'],
  'POST /api/download-leads/register-form': [400, '<html><form method="post" action="/api/download-leads/register-form"><input type="email" name="email" required></form></html>', 'text/html'],
};
function fixtureFetch(routes, calls = []) {
  return async (url, options = {}) => {
    const parsed = new URL(url); const method = options.method || 'GET';
    calls.push({ pathname: parsed.pathname, method, body: options.body });
    const result = routes[`${method} ${parsed.pathname}`] || (method === 'GET' ? routes[parsed.pathname] : null);
    const [status, body, contentType, location] = result || [404, 'missing', 'text/plain'];
    return new Response(body, { status, headers: { 'content-type': contentType, ...(parsed.pathname.startsWith('/api/') || parsed.pathname.startsWith('/downloads/') ? { 'cache-control': 'no-store' } : {}), ...(location ? { location } : {}) } });
  };
}
const capture = (routes = initial, calls = []) => captureManifest(origin, { fetchFn: fixtureFetch(routes, calls), criticalRoutes: ['/'], concurrency: 2 });
async function makeDist(t, routes = initial) {
  const dist = await mkdtemp(path.join(os.tmpdir(), 'newsletter-continuity-'));
  t.after(() => rm(dist, { recursive: true, force: true }));
  for (const [route, [status, body]] of Object.entries(routes)) {
    if (route.startsWith('POST ') || route.startsWith('/api/') || route.startsWith('/downloads/') || status !== 200) continue;
    const filename = path.join(dist, route.endsWith('/') ? `${route}index.html` : route);
    await mkdir(path.dirname(filename), { recursive: true }); await writeFile(filename, body);
  }
  await writeFile(path.join(dist, '_newsletter-redirects.map'), '');
  return dist;
}

test('URL identity preserves methods, API trailing slashes, and meaningful queries', () => {
  assert.equal(normalizeResourceUrl('/api/contributions/submit#x', origin), `${origin}/api/contributions/submit`);
  assert.equal(normalizeResourceUrl('/api/contributions/submit/', origin), `${origin}/api/contributions/submit/`);
  assert.equal(normalizeResourceUrl('/downloads/a.csv?lang=en#x', origin), `${origin}/downloads/a.csv?lang=en`);
  assert.equal(normalizeResourceUrl('mailto:a@example.com', origin), null);
});

test('capture recursively inventories every sitemap, article, form method and relative JS import', async () => {
  const calls = []; const manifest = await capture(initial, calls);
  assert.equal(manifest.version, 1);
  assert.ok(manifest.sitemapUrls.includes(`${origin}/old/`));
  assert.ok(manifest.entries.some((entry) => entry.url.endsWith('/arena/assets/chunk.js') && entry.expectations.sha256));
  assert.ok(manifest.entries.some((entry) => entry.url.endsWith('/old/') && entry.expectations.semanticText.includes('Original editorial')));
  assert.ok(manifest.entries.some((entry) => entry.url.endsWith('/api/contributions/submit') && entry.method === 'POST'));
  assert.equal(calls.some((call) => call.pathname === '/api/contributions/submit' && call.method === 'GET'), false);
  for (const call of calls.filter((call) => call.method === 'POST')) assert.ok(call.body === '{' || call.body === 'company=continuity-check');
});

test('healthy static candidate preserves full sitemap and old assets while declaring infrastructure obligations', async (t) => {
  const manifest = await capture(); const dist = await makeDist(t);
  const result = await validateCandidate(manifest, dist);
  assert.deepEqual(result.failures, []); assert.equal(result.ok, true);
  assert.equal(result.requiresInfrastructureAudit, true);
  assert.ok(result.protectedResources.some((resource) => resource.method === 'POST'));
});

test('candidate rejects missing routes, lost old article text, and changed immutable assets', async (t) => {
  const manifest = await capture(); const dist = await makeDist(t);
  await rm(path.join(dist, 'contribua'), { recursive: true });
  await writeFile(path.join(dist, 'old/index.html'), article.replace('Original editorial argument, which must remain available.', 'An unrelated replacement.'));
  await writeFile(path.join(dist, 'arena/assets/chunk.js'), 'export const answer = 0;');
  const result = await validateCandidate(manifest, dist);
  assert.ok(result.failures.some((error) => error.includes('missing-route') && error.includes('/contribua/')));
  assert.ok(result.failures.some((error) => error.includes('article-content-lost')));
  assert.ok(result.failures.some((error) => error.includes('asset-bytes-changed')));
});

test('aggregate pages can change while article body and contribution form contracts survive', async (t) => {
  const manifest = await capture(); const dist = await makeDist(t);
  await writeFile(path.join(dist, 'index.html'), '<html><main><h1>New daily aggregation</h1></main></html>');
  await writeFile(path.join(dist, 'old/index.html'), article.replace('Updated today', 'Updated tomorrow'));
  assert.equal((await validateCandidate(manifest, dist)).ok, true);
  await writeFile(path.join(dist, 'contribua/index.html'), form.replace('name="content"', 'name="removed"'));
  assert.ok((await validateCandidate(manifest, dist)).failures.some((error) => error.includes('form-contract-lost')));
});

test('explicit redirect permits sitemap migration only when destination exists and retains article body', async (t) => {
  const manifest = await capture(); const dist = await makeDist(t);
  await mkdir(path.join(dist, 'new'), { recursive: true });
  await writeFile(path.join(dist, 'new/index.html'), article);
  await rm(path.join(dist, 'old'), { recursive: true });
  await writeFile(path.join(dist, 'child.xml'), child.replace('/old/', '/new/'));
  const without = await validateCandidate(manifest, dist);
  assert.ok(without.failures.some((error) => error.includes('sitemap-url-lost')));
  await writeFile(path.join(dist, '_newsletter-redirects.map'), '"/old/" "/new/";\n');
  assert.equal((await validateCandidate(manifest, dist)).ok, true);
  await rm(path.join(dist, 'new'), { recursive: true });
  assert.equal((await validateCandidate(manifest, dist)).ok, false);
});

test('capture aborts on unhealthy sitemap entries, assets and invalid POST success', async () => {
  for (const change of [{ '/old/': [404, 'missing', 'text/plain'] }, { '/arena/assets/chunk.js': [500, 'oops', 'text/plain'] }, { 'POST /api/contributions/submit': [201, '{}', 'application/json'] }]) {
    await assert.rejects(capture({ ...initial, ...change }), /baseline-unhealthy/);
  }
});

test('live verification catches broken POST contracts and article replacement', async () => {
  const manifest = await capture();
  assert.equal((await verifyManifest(manifest, origin, { fetchFn: fixtureFetch(initial) })).ok, true);
  const broken = { ...initial, 'POST /api/contributions/submit': [404, '{}', 'application/json'], '/old/': [200, article.replace('Original editorial argument, which must remain available.', 'Changed.'), 'text/html'] };
  const result = await verifyManifest(manifest, origin, { fetchFn: fixtureFetch(broken) });
  assert.ok(result.failures.some((error) => error.includes('unexpected-status') && error.includes('POST')));
  assert.ok(result.failures.some((error) => error.includes('article-content-lost')));
});

test('GET redirects remain explicit in baseline evidence and preserve final resources', async () => {
  const routes = { ...initial, '/old/': [301, '', 'text/html', '/new/'], '/new/': [200, article, 'text/html'] };
  const manifest = await capture(routes);
  const entry = manifest.entries.find((entry) => entry.url === `${origin}/old/`);
  assert.equal(entry.status, 301); assert.equal(entry.finalUrl, `${origin}/new/`);
  assert.deepEqual(entry.redirects, [{ status: 301, from: `${origin}/old/`, to: `${origin}/new/` }]);
});

test('live verification rejects sitemap shrinkage even if old article URL still works', async () => {
  const manifest = await capture();
  const routes = { ...initial, '/child.xml': [200, child.replace('<url><loc>https://fixture.example/old/</loc></url>', ''), 'application/xml'] };
  assert.ok((await verifyManifest(manifest, origin, { fetchFn: fixtureFetch(routes) })).failures.some((error) => error.includes('sitemap-url-lost')));
});

test('robots policy checks associations between crawler groups and rules', async (t) => {
  const robots = 'User-agent: OAI-SearchBot\nAllow: /\nUser-agent: GPTBot\nAllow: /\nUser-agent: *\nAllow: /\nDisallow: /api/download-leads/\n';
  const routes = { ...initial, '/robots.txt': [200, robots, 'text/plain'] };
  const manifest = await captureManifest(origin, { fetchFn: fixtureFetch(routes), criticalRoutes: ['/', '/robots.txt'] });
  const dist = await makeDist(t, routes);
  await writeFile(path.join(dist, 'robots.txt'), robots.replace('User-agent: GPTBot\nAllow: /', 'User-agent: GPTBot\nDisallow: /'));
  assert.ok((await validateCandidate(manifest, dist)).failures.some((error) => error.includes('robots-policy-changed')));
});

test('capture and live verification require no-store on protected forms', async () => {
  const baseFetch = fixtureFetch(initial);
  const fetchFn = async (url, options) => {
    const response = await baseFetch(url, options);
    if (new URL(url).pathname.startsWith('/downloads/')) response.headers.delete('cache-control');
    return response;
  };
  await assert.rejects(captureManifest(origin, { fetchFn, criticalRoutes: ['/'] }), /protected-cache-policy/);
  const manifest = await capture();
  assert.ok((await verifyManifest(manifest, origin, { fetchFn })).failures.some((error) => error.includes('protected-cache-policy')));
});

test('empty article containers cannot masquerade as a healthy content baseline', async () => {
  await assert.rejects(capture({ ...initial, '/old/': [200, article.replace('Original editorial argument, which must remain available.', ''), 'text/html'] }), /empty-article-body/);
});

test('SVG fragments inside CSS data URIs are local fragment references, not HTTP resources', async () => {
  const routes = { ...initial, '/': [200, '<html><main><h1>Home</h1></main><link rel="stylesheet" href="/_astro/main.css"></html>', 'text/html'], '/_astro/main.css': [200, '.a{background:url("data:image/svg+xml,%3Csvg%3E%3Cpath%20fill=\'url(%23n)\'/%3E%3C/svg%3E")} .b{mask:url(#local)}', 'text/css'] };
  const calls = []; const manifest = await capture(routes, calls);
  assert.ok(manifest.entries.some((entry) => entry.url.endsWith('/_astro/main.css')));
  assert.equal(calls.some((call) => call.pathname.includes('%23')), false);
});

test('Cloudflare injected scripts remain healthy edge contracts without pretending dist contains them', async (t) => {
  const script = '/cdn-cgi/challenge-platform/scripts/jsd/main.js';
  const routes = { ...initial, '/': [200, `<html><main><h1>Home</h1></main><script src="${script}"></script></html>`, 'text/html'], [script]: [302, '', 'application/javascript', '/cdn-cgi/challenge-platform/version1.js'], '/cdn-cgi/challenge-platform/version1.js': [200, '/* generated Cloudflare script */', 'application/javascript'] };
  const manifest = await capture(routes);
  const entry = manifest.entries.find((item) => item.url.endsWith(script));
  assert.equal(entry.kind, 'edge-resource'); assert.equal(entry.expectations.sha256, undefined);
  const dist = await makeDist(t, routes); await rm(path.join(dist, 'cdn-cgi'), { recursive: true, force: true });
  const candidate = await validateCandidate(manifest, dist);
  assert.equal(candidate.ok, true); assert.ok(candidate.protectedResources.some((resource) => resource.url.endsWith(script)));
  const changed = { ...routes, [script]: [302, '', 'application/javascript', '/cdn-cgi/challenge-platform/version2.js'], '/cdn-cgi/challenge-platform/version2.js': [200, '/* next healthy edge version */', 'application/javascript'] };
  assert.equal((await verifyManifest(manifest, origin, { fetchFn: fixtureFetch(changed) })).ok, true);
});

test('expected candidate covers new article body, SEO metadata and recursively imported new assets after deploy', async (t) => {
  const baseline = await capture();
  const fresh = '<html lang="en"><head><title>New edition</title><meta name="description" content="New description"><link rel="canonical" href="https://fixture.example/new/"><link rel="alternate" hreflang="pt-BR" href="https://fixture.example/novo/"><meta property="og:title" content="New edition"><script type="application/ld+json">{"@type":"BlogPosting","headline":"New edition"}</script></head><body><main><h1>New edition</h1><div class="article-body"><p>The complete new daily editorial body.</p></div></main><script src="/new-assets/main.js"></script></body></html>';
  const routes = { ...initial, '/child.xml': [200, child.replace('</urlset>', '<url><loc>https://fixture.example/new/</loc></url></urlset>'), 'application/xml'], '/new/': [200, fresh, 'text/html'], '/new-assets/main.js': [200, 'import "./chunk.js";', 'application/javascript'], '/new-assets/chunk.js': [200, 'export const daily = true;', 'application/javascript'], '/novo/': [200, article, 'text/html'] };
  const dist = await makeDist(t, routes);
  const expected = await expectedCandidateManifest(baseline, dist);
  assert.ok(expected.sitemapUrls.includes(`${origin}/new/`));
  assert.ok(expected.entries.some((entry) => entry.url.endsWith('/new-assets/chunk.js') && entry.expectations.sha256));
  assert.equal((await verifyManifest(expected, origin, { fetchFn: fixtureFetch(routes) })).ok, true);
  for (const changed of [[404, 'missing', 'text/plain'], [200, fresh.replace('The complete new daily editorial body.', 'Wrong editorial body.'), 'text/html'], [200, fresh.replace('content="New description"', 'content="Wrong description"'), 'text/html']]) {
    assert.equal((await verifyManifest(expected, origin, { fetchFn: fixtureFetch({ ...routes, '/new/': changed }) })).ok, false);
  }
  assert.equal((await verifyManifest(expected, origin, { fetchFn: fixtureFetch({ ...routes, '/new-assets/chunk.js': [404, 'missing', 'text/plain'] }) })).ok, false);
});

test('expected candidate refuses an unhealthy build and missing new referenced assets', async (t) => {
  const baseline = await capture(); const dist = await makeDist(t);
  await writeFile(path.join(dist, 'old/index.html'), article.replace('Original editorial argument, which must remain available.', 'Lost.'));
  await assert.rejects(expectedCandidateManifest(baseline, dist), /candidate-unhealthy/);
  await writeFile(path.join(dist, 'old/index.html'), article);
  await writeFile(path.join(dist, 'index.html'), '<html><main><h1>Home</h1></main><script src="/new-missing.js"></script></html>');
  await assert.rejects(expectedCandidateManifest(baseline, dist), /candidate-resource-missing/);
});

test('expect-candidate CLI writes evidence atomically and refuses to overwrite existing evidence', async (t) => {
  const baseline = await capture(); const dist = await makeDist(t);
  const baselinePath = path.join(dist, 'baseline.json'); const output = path.join(dist, 'expected.json');
  await writeFile(baselinePath, JSON.stringify(baseline));
  const script = fileURLToPath(new URL('../scripts/newsletter-continuity.mjs', import.meta.url));
  const args = [script, 'expect-candidate', baselinePath, dist, output];
  const first = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert.equal(first.status, 0, first.stderr); assert.equal(JSON.parse(first.stdout).ok, true);
  const second = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert.equal(second.status, 1); assert.match(second.stderr, /EEXIST/);
});

test('known directory 301 uses rendered slash URL for self forms and records the nginx contract', async (t) => {
  const selfForm = '<html><main><h1>Concept</h1><form role="search"><input name="q" type="search"></form></main></html>';
  const routes = { ...initial, '/concept': [301, '', 'text/html', '/concept/'], '/concept/': [200, selfForm, 'text/html'] };
  const manifest = await captureManifest(origin, { fetchFn: fixtureFetch(routes), criticalRoutes: ['/', '/concept'] });
  const dist = await makeDist(t, routes);
  const candidate = await validateCandidate(manifest, dist);
  assert.equal(candidate.ok, true, candidate.failures.join('\n'));
  assert.ok(candidate.automaticDirectoryRedirects.some((redirect) => redirect.from === `${origin}/concept` && redirect.to === `${origin}/concept/` && redirect.status === 301 && redirect.contract === 'nginx-directory-index'));
  const expected = await expectedCandidateManifest(manifest, dist);
  const entry = expected.entries.find((item) => item.url === `${origin}/concept`);
  assert.equal(entry.finalUrl, `${origin}/concept/`); assert.equal(entry.expectations.forms[0].action, '/concept/');
  assert.equal((await verifyManifest(expected, origin, { fetchFn: fixtureFetch(routes) })).ok, true);
  const wrongStatus = { ...routes, '/concept': [302, '', 'text/html', '/concept/'] };
  assert.ok((await verifyManifest(expected, origin, { fetchFn: fixtureFetch(wrongStatus) })).failures.some((error) => error.includes('directory-redirect-status-changed')));
  await writeFile(path.join(dist, 'concept/index.html'), selfForm.replace('name="q"', 'name="removed"'));
  assert.ok((await validateCandidate(manifest, dist)).failures.some((error) => error.includes('form-contract-lost')));
});

test('old article canonical and JSONLD remain preserved while aggregate item lists can grow', async (t) => {
  const old = article.replace('<title>Old article</title>', '<title>Old article</title><meta name="description" content="Editorial description"><link rel="canonical" href="https://fixture.example/old/"><script type="application/ld+json">{"@type":"BlogPosting","headline":"Old article","url":"https://fixture.example/old/"}</script>');
  const aggregate = '<html lang="pt-BR"><head><title>Daily index</title><script type="application/ld+json">{"@type":"ItemList","numberOfItems":1,"itemListElement":[{"url":"https://fixture.example/old/"}]}</script></head><main><h1>Daily index</h1></main></html>';
  const routes = { ...initial, '/old/': [200, old, 'text/html'], '/': [200, aggregate, 'text/html'] };
  const manifest = await capture(routes); const dist = await makeDist(t, routes);
  await writeFile(path.join(dist, 'old/index.html'), old.replace('rel="canonical" href="https://fixture.example/old/"', 'rel="canonical" href="https://fixture.example/wrong/"'));
  assert.ok((await validateCandidate(manifest, dist)).failures.some((error) => error.includes('html-metadata-changed:canonical')));
  await writeFile(path.join(dist, 'old/index.html'), old.replace('"headline":"Old article"', '"headline":"Wrong title"'));
  assert.ok((await validateCandidate(manifest, dist)).failures.some((error) => error.includes('html-metadata-changed:jsonLd')));
  await writeFile(path.join(dist, 'old/index.html'), old);
  await writeFile(path.join(dist, 'index.html'), aggregate.replace('"numberOfItems":1', '"numberOfItems":2').replace('"itemListElement":[', '"itemListElement":[{"url":"https://fixture.example/new/"},'));
  assert.equal((await validateCandidate(manifest, dist)).ok, true);
});

test('expected RSS and LLMS documents cover PT/EN newsletter URLs and exact deployed document bytes', async (t) => {
  const emptyRss = '<rss><channel><title>Fixture</title></channel></rss>';
  const documents = { '/rss.xml': [200, emptyRss, 'application/xml'], '/llms.txt': [200, '# Fixture\nEditorial index.\n', 'text/plain'], '/llms-full.txt': [200, '# Fixture full\nEditorial corpus.\n', 'text/plain'] };
  const older = `${origin}/newsletter/older/`;
  const oldChild = child.replace('</urlset>', `<url><loc>${older}</loc></url></urlset>`);
  const baseRoutes = { ...initial, ...documents, '/child.xml': [200, oldChild, 'application/xml'], '/newsletter/older/': [200, article, 'text/html'] };
  const baseline = await captureManifest(origin, { fetchFn: fixtureFetch(baseRoutes), criticalRoutes: ['/', ...Object.keys(documents)] });
  const pt = `${origin}/newsletter/new/`; const en = `${origin}/en/newsletter/new/`;
  const rss = `<rss><channel><title>Fixture</title><item><link>${pt}</link></item></channel></rss>`;
  const full = `# Fixture full\nURL: ${older}\nURL: ${pt}\nURL: ${en}\n`;
  const routes = { ...baseRoutes, '/child.xml': [200, oldChild.replace('</urlset>', `<url><loc>${pt}</loc></url><url><loc>${en}</loc></url></urlset>`), 'application/xml'], '/newsletter/new/': [200, article, 'text/html'], '/en/newsletter/new/': [200, article, 'text/html'], '/rss.xml': [200, rss, 'application/xml'], '/llms-full.txt': [200, full, 'text/plain'] };
  const dist = await makeDist(t, routes); const expected = await expectedCandidateManifest(baseline, dist);
  assert.ok(expected.entries.find((entry) => entry.url.endsWith('/rss.xml')).expectations.sha256);
  assert.ok(expected.entries.find((entry) => entry.url.endsWith('/llms-full.txt')).expectations.sha256);
  assert.equal((await verifyManifest(expected, origin, { fetchFn: fixtureFetch(routes) })).ok, true);
  assert.ok((await verifyManifest(expected, origin, { fetchFn: fixtureFetch({ ...routes, '/rss.xml': [200, emptyRss, 'application/xml'] }) })).failures.some((error) => error.includes('document-bytes-changed')));
  assert.ok((await verifyManifest(expected, origin, { fetchFn: fixtureFetch({ ...routes, '/llms-full.txt': documents['/llms-full.txt'] }) })).failures.some((error) => error.includes('document-bytes-changed')));
  await writeFile(path.join(dist, 'rss.xml'), emptyRss);
  await assert.rejects(expectedCandidateManifest(baseline, dist), /rss-newsletter-url-missing/);
  await writeFile(path.join(dist, 'rss.xml'), rss); await writeFile(path.join(dist, 'llms-full.txt'), `# Fixture full\nURL: ${pt}\n`);
  await assert.rejects(expectedCandidateManifest(baseline, dist), /llms-newsletter-url-missing/);
});

function editionFixture() {
  const pt = `${origin}/newsletter/required-edition/`; const en = `${origin}/en/newsletter/required-edition/`;
  const contract = { kind: 'daily', origin, base: 'base-commit', head: 'head-commit', editionsRequired: [{ date: '2026-10-01', file: 'src/content/newsletters/2026-10-01-required-edition.md', pt: { seoSlug: 'required-edition', url: pt }, en: { seoSlug: 'required-edition', url: en } }] };
  const html = (lang, url) => `<html lang="${lang}"><head><title>Required edition</title><link rel="canonical" href="${url}"><link rel="alternate" hreflang="pt-BR" href="${pt}"><link rel="alternate" hreflang="en" href="${en}"><meta property="article:published_time" content="2026-10-01T12:00:00Z"><meta name="robots" content="index, follow"></head><body><main><article><h1>Required edition</h1><div class="article-body"><p>The required daily edition has real editorial content.</p></div></article></main></body></html>`;
  return { contract, pt, en, routes: { ...initial, '/child.xml': [200, child.replace('</urlset>', `<url><loc>${pt}</loc></url><url><loc>${en}</loc></url></urlset>`), 'application/xml'], '/newsletter/required-edition/': [200, html('pt-BR', pt), 'text/html'], '/en/newsletter/required-edition/': [200, html('en', en), 'text/html'], '/rss.xml': [200, `<rss><channel><item><link>${pt}</link></item></channel></rss>`, 'application/xml'], '/llms-full.txt': [200, `# Fixture full\nURL: ${pt}\nURL: ${en}\n`, 'text/plain'] } };
}

test('verify-editions binds daily contract to emitted bilingual pages and publication surfaces', async (t) => {
  const { contract, routes } = editionFixture(); const dist = await makeDist(t, routes);
  const result = await verifyEditions(contract, dist);
  assert.equal(result.ok, true, result.failures.join('\n')); assert.equal(result.counts.editions, 1); assert.equal(result.counts.pages, 2);
  assert.equal(result.base, contract.base); assert.equal(result.head, contract.head);
  await rm(path.join(dist, 'en/newsletter/required-edition'), { recursive: true });
  assert.ok((await verifyEditions(contract, dist)).failures.some((failure) => failure.includes('missing-edition-page')));
});

test('verify-editions rejects draft-skipped pages, canonical, language, hreflang and indexing mismatches', async (t) => {
  const { contract, routes, pt } = editionFixture(); const dist = await makeDist(t, routes);
  const filename = path.join(dist, 'newsletter/required-edition/index.html'); const html = routes['/newsletter/required-edition/'][1];
  for (const [candidate, marker] of [[html.replace(`rel="canonical" href="${pt}"`, 'rel="canonical" href="https://fixture.example/wrong/"'), 'edition-canonical-mismatch'], [html.replace('lang="pt-BR"', 'lang="en"'), 'edition-language-mismatch'], [html.replace('hreflang="en"', 'hreflang="fr"'), 'edition-hreflang-mismatch'], [html.replace('index, follow', 'noindex, follow'), 'edition-not-indexable']]) {
    await writeFile(filename, candidate);
    assert.ok((await verifyEditions(contract, dist)).failures.some((failure) => failure.includes(marker)), marker);
  }
  await rm(filename);
  assert.ok((await verifyEditions(contract, dist)).failures.some((failure) => failure.includes('missing-edition-page')));
});

test('verify-editions requires sitemap, PT RSS and PT/EN LLMS entries independently', async (t) => {
  const { contract, routes, pt, en } = editionFixture(); const dist = await makeDist(t, routes);
  for (const [file, original, changed, marker] of [['child.xml', routes['/child.xml'][1], routes['/child.xml'][1].replace(`<url><loc>${pt}</loc></url>`, ''), 'edition-sitemap-url-missing'], ['rss.xml', routes['/rss.xml'][1], '<rss><channel></channel></rss>', 'edition-rss-url-missing'], ['llms-full.txt', routes['/llms-full.txt'][1], `# Fixture full\nURL: ${pt}\n`, 'edition-llms-url-missing']]) {
    await writeFile(path.join(dist, file), changed);
    assert.ok((await verifyEditions(contract, dist)).failures.some((failure) => failure.includes(marker)), `${marker}: ${en}`);
    await writeFile(path.join(dist, file), original);
  }
});

test('only setup contracts may have no required editions', async () => {
  assert.equal((await verifyEditions({ kind: 'setup', editionsRequired: [], base: 'base', head: 'head' }, '/absent-dist')).ok, true);
  assert.equal((await verifyEditions({ kind: 'daily', editionsRequired: [] }, '/absent-dist')).ok, false);
});

test('continuity records meta and HTTP robots, allowing safe headers but detecting new noindex', async (t) => {
  const routes = { ...initial, '/old/': [200, article.replace('</head>', '<meta name="robots" content="index, follow"></head>'), 'text/html'] };
  const baseFetch = fixtureFetch(routes);
  const safeFetch = async (url, options) => { const response = await baseFetch(url, options); if (new URL(url).pathname === '/old/') response.headers.set('x-robots-tag', 'max-image-preview:large, index, follow'); return response; };
  const manifest = await captureManifest(origin, { fetchFn: safeFetch, criticalRoutes: ['/'] });
  assert.equal(manifest.entries.find((entry) => entry.url === `${origin}/old/`).expectations.xRobotsTag, 'max-image-preview:large, index, follow');
  assert.equal((await verifyManifest(manifest, origin, { fetchFn: baseFetch })).ok, true);
  const safePreviewFetch = async (url, options) => { const response = await baseFetch(url, options); if (new URL(url).pathname === '/old/') response.headers.set('x-robots-tag', 'max-image-preview:none, max-snippet:-1, index, follow'); return response; };
  assert.equal((await verifyManifest(manifest, origin, { fetchFn: safePreviewFetch })).ok, true);
  const badFetch = async (url, options) => { const response = await safeFetch(url, options); if (new URL(url).pathname === '/old/') response.headers.set('x-robots-tag', 'noindex'); return response; };
  assert.ok((await verifyManifest(manifest, origin, { fetchFn: badFetch })).failures.some((failure) => failure.includes('http-robots-restrictions-changed')));
  const dist = await makeDist(t, routes); await writeFile(path.join(dist, 'old/index.html'), routes['/old/'][1].replace('index, follow', 'noindex, follow'));
  assert.ok((await validateCandidate(manifest, dist)).failures.some((failure) => failure.includes('html-metadata-changed:robots')));
});

test('verify-editions CLI succeeds for setup and rejects daily contracts with omitted editions', async (t) => {
  const dist = await makeDist(t); const contractPath = path.join(dist, 'contract.json');
  const script = fileURLToPath(new URL('../scripts/newsletter-continuity.mjs', import.meta.url));
  await writeFile(contractPath, JSON.stringify({ kind: 'setup', base: 'base', head: 'head', editionsRequired: [] }));
  const setup = spawnSync(process.execPath, [script, 'verify-editions', contractPath, dist], { encoding: 'utf8' });
  assert.equal(setup.status, 0, setup.stderr); assert.equal(JSON.parse(setup.stdout).ok, true);
  await writeFile(contractPath, JSON.stringify({ kind: 'daily', editionsRequired: [] }));
  const daily = spawnSync(process.execPath, [script, 'verify-editions', contractPath, dist], { encoding: 'utf8' });
  assert.equal(daily.status, 1); assert.equal(JSON.parse(daily.stdout).ok, false);
});

test('new aggregate pages keep their own robots policy without inheriting unrelated baseline headers', async (t) => {
  const baseline = await capture();
  const routes = { ...initial, '/': [200, '<html><main><h1>Daily index</h1><a href="/new-index/">New index</a></main></html>', 'text/html'], '/new-index/': [200, '<html><head><meta name="robots" content="noindex, follow"></head><main><h1>New aggregate page</h1></main></html>', 'text/html'] };
  const dist = await makeDist(t, routes); const expected = await expectedCandidateManifest(baseline, dist);
  const page = expected.entries.find((entry) => entry.url === `${origin}/new-index/`);
  assert.equal(page.expectations.metadata.robots, 'noindex, follow'); assert.equal(page.expectations.indexable, undefined); assert.equal(page.expectations.xRobotsTag, undefined);
  const baseFetch = fixtureFetch(routes);
  const fetchFn = async (url, options) => { const response = await baseFetch(url, options); if (new URL(url).pathname === '/new-index/') response.headers.set('x-robots-tag', 'noindex'); return response; };
  assert.equal((await verifyManifest(expected, origin, { fetchFn })).ok, true);
});
