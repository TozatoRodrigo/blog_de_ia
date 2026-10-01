import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const STATIC_EXTENSION = /\.(?:m?js|css|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|eot|mp[34]|webm|ogg|wav|pdf|zip|csv|json|map)$/i;
const SAFE_POSTS = new Set(['/api/contributions/submit', '/api/download-leads/register', '/api/download-leads/register-form', '/api/download-leads/authorize']);
const SAFE_GETS = new Set(['/api/download-leads/health', '/api/download-leads/config', '/api/download-leads/file/invalid']);
const REDIRECTS = new Set([301, 302, 303, 307, 308]);
export const CRITICAL_ROUTES = ['/', '/en/', '/arena/', '/contribua/', '/en/contribute/', '/contribuicoes/', '/en/contributions/', '/privacidade/', '/en/privacy/', '/robots.txt', '/rss.xml', '/llms.txt', '/llms-full.txt', '/api/download-leads/health', '/api/download-leads/config', '/api/download-leads/file/invalid', '/downloads/ai-risk-matrix.csv', ...[...SAFE_POSTS].map((url) => ({ url, method: 'POST' }))];
const hash = (body) => createHash('sha256').update(body).digest('hex');
const text = (value) => value.replace(/\s+/g, ' ').trim();
const identity = (method, url) => `${method} ${url}`;
const resourcePath = (url) => { const parsed = new URL(url); return `${parsed.pathname}${parsed.search}`; };
const mime = (contentType) => (contentType || '').split(';')[0].trim().toLowerCase();
const infrastructureResource = (entry) => ['protected-resource', 'edge-resource'].includes(entry.kind) || entry.method !== 'GET';
const stableValue = (value) => Array.isArray(value) ? value.map(stableValue) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])])) : value;
const stableJson = (value) => JSON.stringify(stableValue(value));
function robotsRestrictions(value) {
  const directives = String(value || '').toLowerCase().split(/[,;]+/).flatMap((token) => {
    // A policy value such as max-image-preview:none is not the robots "none"
    // directive. Agent prefixes (googlebot:noindex) still carry restrictions.
    if (/^\s*(?:max-[\w-]+|unavailable_after)\s*:/.test(token)) return [];
    const directive = token.trim().replace(/^[\w.*-]+\s*:\s*/, '');
    return (directive.match(/\b(?:noindex|nofollow|noarchive|nosnippet|noimageindex|notranslate|none)\b/g) || []).flatMap((item) => item === 'none' ? ['noindex', 'nofollow'] : [item]);
  });
  return [...new Set(directives)].sort();
}

function aggregateSchema(value) {
  if (Array.isArray(value)) return value.map(aggregateSchema);
  if (!value || typeof value !== 'object') return value;
  // Collection item lists and their counters grow with each daily edition.
  return Object.fromEntries(Object.entries(value).filter(([key]) => !['itemListElement', 'numberOfItems', 'dateModified'].includes(key)).map(([key, item]) => [key, aggregateSchema(item)]));
}

function preservedMetadata(contract) {
  const article = Boolean(contract.expectations.semanticText);
  const metadata = { ...contract.metadata };
  if (!article) { delete metadata.dates; metadata.jsonLd = aggregateSchema(metadata.jsonLd); }
  return { metadata, metadataMode: article ? 'article' : 'aggregate' };
}

// Resource identity never adds/removes slashes. In particular POST /api/x and
// GET /api/x/ are different contracts, and ?lang=en is a meaningful resource.
export function normalizeResourceUrl(value, base, origin = new URL(base).origin) {
  try {
    if (!value || value.includes('${')) return null;
    const url = new URL(value, base);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) return null;
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) if (/^(?:utm_|smoke$)/i.test(key)) url.searchParams.delete(key);
    return url.href;
  } catch { return null; }
}

function sitemapLinks(body, base, origin) {
  const $ = cheerio.load(body, { xmlMode: true });
  const root = $.root().children().first();
  const rootName = root[0]?.name?.split(':').at(-1);
  if (!['sitemapindex', 'urlset'].includes(rootName) || !new RegExp(`</(?:[\\w-]+:)?${rootName}\\s*>`, 'i').test(body)) throw new Error(`invalid-sitemap: ${base}`);
  const child = rootName === 'sitemapindex' ? 'sitemap' : 'url';
  const locations = $('*').toArray().filter((node) => node.name?.split(':').at(-1) === 'loc' && node.parent?.name?.split(':').at(-1) === child).map((node) => $(node).text().trim());
  if (!locations.length) throw new Error(`empty-sitemap: ${base}`);
  return { type: rootName, urls: locations.map((location) => {
    const url = normalizeResourceUrl(location, base, origin);
    if (!url) throw new Error(`external-or-invalid-sitemap-location: ${location}`);
    return url;
  }) };
}

function literalResources(body, base, origin) {
  const resources = [];
  const add = (value) => {
    // SVG paint/filter IDs in embedded data URIs are encoded fragments. They
    // have no HTTP representation and must not become a relative asset URL.
    if (/^(?:#|%23)/i.test(value)) return;
    const url = normalizeResourceUrl(value, base, origin); if (url) resources.push(url);
  };
  // All asset literals cover static/dynamic imports, Vite preload arrays, worker
  // constructors and CSS URLs. Bare package names and template expressions are
  // intentionally excluded; no inferred user data or token URL is requested.
  for (const match of body.matchAll(/["'`]((?:\.\.?\/|\/|https?:\/\/)[^"'`\s<>]+)["'`]/g)) {
    const value = match[1];
    if (STATIC_EXTENSION.test(value.split(/[?#]/)[0]) || value.startsWith('/api/')) add(value);
  }
  for (const match of body.matchAll(/(?:url\(\s*|@import\s+)["']?([^\s"')]+)["']?\s*\)?/g)) add(match[1]);
  return [...new Set(resources)];
}

function htmlContract(body, base, origin) {
  const $ = cheerio.load(body);
  const pageBase = new URL($('base[href]').first().attr('href') || base, base).href;
  const resources = [];
  const add = (value, method = 'GET') => { const url = normalizeResourceUrl(value, pageBase, origin); if (url) resources.push({ url, method }); };
  $('a[href],link[href],script[src],img[src],iframe[src],source[src],video[src],audio[src],input[src],object[data],video[poster]').each((_, node) => {
    for (const attr of ['href', 'src', 'data', 'poster']) if ($(node).attr(attr)) add($(node).attr(attr));
  });
  $('[srcset]').each((_, node) => { for (const entry of $(node).attr('srcset').split(',')) add(entry.trim().split(/\s+/)[0]); });
  $('meta[property="og:image"],meta[name="twitter:image"]').each((_, node) => add($(node).attr('content')));
  $('[style]').each((_, node) => { for (const url of literalResources($(node).attr('style'), pageBase, origin)) add(url); });
  $('script:not([src]),style').each((_, node) => { for (const url of literalResources($(node).html() || '', pageBase, origin)) add(url, SAFE_POSTS.has(new URL(url).pathname) ? 'POST' : 'GET'); });
  const forms = $('form').toArray().map((node) => {
    const form = $(node); const method = (form.attr('method') || 'GET').toUpperCase();
    const action = new URL(form.attr('action') || base, pageBase).href;
    add(action, method);
    return { method, action: resourcePath(action), enctype: form.attr('enctype') || 'application/x-www-form-urlencoded', fields: form.find('input[name],textarea[name],select[name],button[name]').toArray().map((field) => ({ name: $(field).attr('name'), tag: field.name, type: $(field).attr('type') || (field.name === 'input' ? 'text' : field.name), required: $(field).attr('required') !== undefined, ...($(field).attr('type') === 'hidden' ? { value: $(field).attr('value') || '' } : {}) })) };
  });
  const markers = [];
  for (const selector of ['[data-contribution-form]', '[data-contribution-form-root]', '[data-contribution-success]', '[data-contribution-status]', '[data-turnstile]', '[data-privacy-version]', '[data-contact-direct="true"]', '.cf-turnstile']) if ($(selector).length) markers.push(selector);
  $('[data-action]').each((_, node) => markers.push(`[data-action=${JSON.stringify($(node).attr('data-action'))}]`));
  const contactLinks = $('[data-contact-direct="true"]').length ? $('a[href^="mailto:"]').toArray().map((node) => $(node).attr('href')) : [];
  const articleBody = $('.article-body,[data-article-body],.prose').first().clone();
  articleBody.find('script,style,time,nav,[data-dynamic-metadata],.article-header__meta').remove();
  const semanticText = articleBody.length ? text(articleBody.text()) : null;
  const alternateUrls = $('link[rel="alternate"][hreflang]').toArray().map((node) => ({ lang: $(node).attr('hreflang'), url: $(node).attr('href') }));
  const dates = [...new Set($('time[datetime],meta[property="article:published_time"],meta[property="article:modified_time"]').toArray().map((node) => $(node).attr('datetime') || $(node).attr('content')))];
  const jsonLd = $('script[type="application/ld+json"]').toArray().map((node) => {
    try { return stableValue(JSON.parse($(node).html() || '')); } catch { throw new Error('invalid-jsonld'); }
  });
  const metadata = { dates, alternateUrls: alternateUrls.sort((a, b) => `${a.lang}:${a.url}`.localeCompare(`${b.lang}:${b.url}`)), canonical: $('link[rel="canonical"]').first().attr('href') || null, lang: $('html').attr('lang') || null, title: text($('title').first().text()), description: $('meta[name="description"]').first().attr('content') || null, robots: $('meta[name="robots"]').toArray().map((node) => $(node).attr('content') || '').filter(Boolean).join(', ') || null, openGraph: $('meta[property^="og:"]').toArray().map((node) => ({ property: $(node).attr('property'), content: $(node).attr('content') || '' })).sort((a, b) => `${a.property}:${a.content}`.localeCompare(`${b.property}:${b.content}`)), jsonLd };
  return { resources, expectations: { html: true, hasMain: $('main').length > 0, hasH1: $('h1').length > 0, hasArticleBody: articleBody.length > 0, ...(semanticText ? { semanticText, semanticSha256: hash(semanticText), articleTitle: text($('h1').first().text()) } : {}), forms, markers: [...new Set(markers)], contactLinks }, metadata };
}

function compareHtml(expectations, body, url, origin) {
  const contract = htmlContract(body, url, origin); const current = contract.expectations;
  const failures = [];
  if (!/<(?:!doctype\s+html|html|main|body)\b/i.test(body)) failures.push('expected-html');
  if (expectations.hasMain && !current.hasMain) failures.push('main-element-lost');
  if (expectations.hasH1 && !current.hasH1) failures.push('h1-element-lost');
  if (expectations.semanticText && (!current.semanticText?.includes(expectations.semanticText) || current.articleTitle !== expectations.articleTitle)) failures.push('article-content-lost');
  for (const expected of expectations.forms || []) {
    const actual = current.forms.find((form) => form.method === expected.method && form.action === expected.action && form.enctype === expected.enctype);
    if (!actual || expected.fields.some((field) => !actual.fields.some((candidate) => Object.entries(field).every(([key, value]) => candidate[key] === value)))) failures.push(`form-contract-lost:${expected.method} ${expected.action}`);
  }
  const $ = cheerio.load(body);
  for (const marker of expectations.markers || []) if (!$(marker).length) failures.push(`form-marker-lost:${marker}`);
  for (const link of expectations.contactLinks || []) if (!$('a[href]').toArray().some((node) => $(node).attr('href') === link)) failures.push('direct-contact-lost');
  if ((expectations.contactLinks || []).length && body.includes('/cdn-cgi/l/email-protection')) failures.push('direct-contact-obfuscated');
  if (expectations.metadata) for (const [key, value] of Object.entries(expectations.metadata)) {
    const actual = key === 'jsonLd' && expectations.metadataMode === 'aggregate' ? aggregateSchema(contract.metadata[key]) : contract.metadata[key];
    if (stableJson(actual) !== stableJson(value)) failures.push(`html-metadata-changed:${key}`);
  }
  return failures;
}

function validateDynamic(url, body) {
  const route = new URL(url).pathname;
  if (route === '/api/download-leads/health') {
    try { if (JSON.parse(body).status !== 'ok') return ['health-not-ok']; } catch { return ['invalid-health-json']; }
  }
  if (route === '/api/download-leads/config') {
    try {
      const config = JSON.parse(body);
      if (JSON.stringify(Object.keys(config).sort()) !== JSON.stringify(['contributionPrivacyVersion', 'privacyVersion', 'turnstileSiteKey']) || Object.values(config).some((value) => typeof value !== 'string' || !value)) return ['invalid-public-config-contract'];
    } catch { return ['invalid-public-config-json']; }
  }
  return [];
}

function robotsPolicy(body) {
  const policy = {}; let agents = []; let hadRule = false;
  for (const raw of body.split(/\r?\n/)) {
    const match = raw.split('#')[0].trim().match(/^(User-agent|Allow|Disallow):\s*(.*?)\s*$/i);
    if (!match) continue;
    if (match[1].toLowerCase() === 'user-agent') {
      if (hadRule) { agents = []; hadRule = false; }
      agents.push(match[2].toLowerCase()); policy[match[2].toLowerCase()] ||= [];
    } else {
      hadRule = true;
      for (const agent of agents) policy[agent].push(`${match[1].toLowerCase()}:${match[2]}`);
    }
  }
  return Object.fromEntries(Object.entries(policy).map(([agent, rules]) => [agent, [...new Set(rules)].sort()]));
}

function safeProbe(url) {
  // Malformed JSON is rejected by parseBody before rate limiting, workflow or
  // database access. The form endpoint rejects a nonempty honeypot beforehand.
  return new URL(url).pathname.endsWith('register-form')
    ? { contentType: 'application/x-www-form-urlencoded', body: 'company=continuity-check', reason: 'invalid-honeypot-before-workflow' }
    : { contentType: 'application/json', body: '{', reason: 'invalid-json-before-workflow' };
}

async function requestResource(url, method, { fetchFn = fetch, timeoutMs = 30_000 } = {}) {
  const redirects = []; let current = url; let response; let initialStatus;
  for (let depth = 0; depth <= 8; depth++) {
    const probe = safeProbe(url);
    response = await fetchFn(current, { method, redirect: 'manual', signal: AbortSignal.timeout(timeoutMs), headers: { accept: '*/*', ...(method === 'POST' ? { origin: new URL(url).origin, 'content-type': probe.contentType } : {}) }, ...(method === 'POST' ? { body: probe.body } : {}) });
    initialStatus ??= response.status;
    if (!REDIRECTS.has(response.status)) break;
    if (method !== 'GET') throw new Error('invalid-post-redirect');
    const location = response.headers.get('location');
    if (!location) throw new Error('redirect-without-location');
    const next = normalizeResourceUrl(location, current, new URL(url).origin);
    if (!next) throw new Error('external-redirect');
    redirects.push({ status: response.status, from: current, to: next });
    if (redirects.some((redirect) => redirect.from === next)) throw new Error('redirect-cycle');
    if (depth === 8) throw new Error('too-many-redirects');
    await response.arrayBuffer(); current = next;
  }
  const body = Buffer.from(await response.arrayBuffer());
  return { status: initialStatus, finalStatus: response.status, finalUrl: current, redirects, contentType: mime(response.headers.get('content-type')), cacheControl: response.headers.get('cache-control') || '', xRobotsTag: response.headers.get('x-robots-tag') || '', body };
}

function counts(entries) {
  return { entries: entries.length, methods: Object.fromEntries([...new Set(entries.map((entry) => entry.method))].sort().map((method) => [method, entries.filter((entry) => entry.method === method).length])), kinds: Object.fromEntries([...new Set(entries.map((entry) => entry.kind))].sort().map((kind) => [kind, entries.filter((entry) => entry.kind === kind).length])) };
}

export async function captureManifest(inputOrigin, options = {}) {
  const origin = new URL(inputOrigin).origin; const queue = []; const seen = new Set();
  const entries = []; const failures = []; const sitemapUrls = new Set(); const unprobedResources = [];
  const add = (value, method = 'GET', source = 'discovered', sitemap = false) => {
    const url = normalizeResourceUrl(value, `${origin}/`, origin); if (!url) return;
    const route = new URL(url).pathname;
    // Literal API references carry known methods; GET probes cannot establish a
    // POST contract, and unknown forms are recorded for an infrastructure audit.
    const key = identity(method, url); if (seen.has(key)) return; seen.add(key);
    if ((method !== 'GET' && (method !== 'POST' || !SAFE_POSTS.has(route))) || (route.startsWith('/api/') && method === 'GET' && !SAFE_GETS.has(route))) { unprobedResources.push({ method, url, source, reason: 'requires-explicit-safe-probe-contract' }); return; }
    queue.push({ method, url, source, sitemap });
  };
  add('/sitemap-index.xml', 'GET', 'sitemap-root', true);
  for (const route of options.criticalRoutes || CRITICAL_ROUTES) add(typeof route === 'string' ? route : route.url, typeof route === 'string' ? 'GET' : route.method, 'critical');
  const concurrency = Math.max(1, Math.min(options.concurrency || 6, 12));
  while (queue.length) {
    const batch = queue.splice(0, concurrency);
    await Promise.all(batch.map(async (item) => {
      const label = identity(item.method, item.url);
      try {
        const response = await requestResource(item.url, item.method, options); const bodyText = response.body.toString('utf8');
        const route = new URL(item.url).pathname;
        const expectedStatus = item.method === 'POST' ? [400, 422] : route === '/api/download-leads/file/invalid' ? [404] : [200];
        if (!expectedStatus.includes(response.finalStatus)) throw new Error(`unexpected-status:${response.finalStatus}`);
        const dynamic = route.startsWith('/api/') || route.startsWith('/downloads/');
        const kind = item.sitemap ? 'sitemap' : item.method === 'POST' ? 'invalid-post' : dynamic ? 'protected-resource' : route.startsWith('/cdn-cgi/') ? 'edge-resource' : /(?:rss\.xml|robots\.txt|llms(?:-full)?\.txt)$/.test(route) ? 'machine-document' : STATIC_EXTENSION.test(route) ? 'asset' : response.contentType.includes('html') ? 'page' : 'asset';
        let expectations = { status: response.finalStatus, contentType: response.contentType, xRobotsTag: response.xRobotsTag, ...(item.method === 'POST' ? { probe: safeProbe(item.url) } : {}) }; let metadata;
        if (dynamic) {
          if (!/(?:^|[,\s])no-store(?:$|[,\s])/i.test(response.cacheControl)) throw new Error('protected-cache-policy:missing-no-store');
          expectations.noStore = true;
        }
        if (kind === 'sitemap') {
          const links = sitemapLinks(bodyText, response.finalUrl, origin);
          for (const url of links.urls) { if (links.type === 'urlset') sitemapUrls.add(url); add(url, 'GET', item.url, links.type === 'sitemapindex'); }
          expectations.sitemapType = links.type;
        } else if (kind === 'edge-resource') {
          if (response.contentType.includes('html') || !response.body.length) throw new Error('edge-script-unhealthy');
          expectations.edgeManaged = true;
        } else if (kind === 'asset') {
          if (response.contentType.includes('html')) throw new Error('asset-returned-html');
          expectations.sha256 = hash(response.body); expectations.bytes = response.body.length;
          if (/\.(?:m?js|css)$/.test(route)) for (const url of literalResources(bodyText, response.finalUrl, origin)) add(url, SAFE_POSTS.has(new URL(url).pathname) ? 'POST' : 'GET', item.url);
        } else if (kind === 'page' || (dynamic && response.contentType.includes('html'))) {
          const contract = htmlContract(bodyText, response.finalUrl, origin);
          expectations = { ...expectations, ...contract.expectations }; metadata = contract.metadata;
          if (kind === 'page') expectations = { ...expectations, ...preservedMetadata(contract) };
          if (contract.expectations.hasArticleBody && !contract.expectations.semanticText) throw new Error('empty-article-body');
          for (const resource of contract.resources) add(resource.url, resource.method, item.url, /\/sitemap[^/]*\.xml$/.test(new URL(resource.url).pathname));
          if (kind === 'page' && !/<!doctype|<html|<main/i.test(bodyText)) throw new Error('expected-html');
          if (route.startsWith('/downloads/') && !contract.expectations.forms.some((form) => form.method === 'POST' && form.fields.some((field) => field.type === 'email'))) throw new Error('protected-download-form-lost');
        } else if (kind === 'machine-document') {
          if (route.endsWith('rss.xml')) {
            if (!/<rss\b/i.test(bodyText)) throw new Error('invalid-rss');
            const $ = cheerio.load(bodyText, { xmlMode: true });
            $('item > link').each((_, node) => add($(node).text(), 'GET', item.url));
            metadata = { items: $('item').toArray().map((node) => ({ url: $(node).find('link').text().trim(), publishedAt: $(node).find('pubDate').text().trim() })) };
            expectations.requiredMarkers = ['<rss'];
          } else if (route.endsWith('robots.txt')) {
            expectations.robotsPolicy = robotsPolicy(bodyText);
            for (const agent of ['gptbot', 'oai-searchbot', '*']) if (!expectations.robotsPolicy[agent]?.includes('allow:/') || expectations.robotsPolicy[agent]?.includes('disallow:/')) throw new Error(`robots-crawler-blocked:${agent}`);
            if (Object.values(expectations.robotsPolicy).some((rules) => rules.some((rule) => /^disallow:\/downloads\/?$/.test(rule)))) throw new Error('robots-protected-forms-blocked');
            expectations.requiredMarkers = bodyText.split(/\r?\n/).map((line) => line.trim()).filter((line) => /^(?:User-agent|Allow|Disallow):/i.test(line));
            for (const match of bodyText.matchAll(/^Sitemap:\s*(\S+)/gmi)) add(match[1], 'GET', item.url, true);
            if (!expectations.requiredMarkers.length) throw new Error('empty-robots-contract');
          } else {
            expectations.requiredMarkers = [bodyText.split(/\r?\n/).find((line) => /^#\s+/.test(line))].filter(Boolean);
            if (!expectations.requiredMarkers.length) throw new Error('empty-llms-contract');
            for (const match of bodyText.matchAll(/https?:\/\/[^\s<>\])]+/g)) add(match[0], 'GET', item.url);
          }
        }
        const dynamicErrors = item.method === 'GET' ? validateDynamic(item.url, bodyText) : [];
        if (dynamicErrors.length) throw new Error(dynamicErrors.join(','));
        entries.push({ method: item.method, url: item.url, finalUrl: response.finalUrl, status: response.status, finalStatus: response.finalStatus, redirects: response.redirects, kind, source: item.source, expectations, ...(metadata ? { metadata } : {}) });
      } catch (error) { failures.push(`${label}: ${error.message}`); }
    }));
    options.onProgress?.({ captured: entries.length, remaining: queue.length, failures: failures.length });
  }
  if (failures.length || !sitemapUrls.size) throw new Error(`baseline-unhealthy\n${[...failures.sort(), ...(!sitemapUrls.size ? ['empty-public-sitemap'] : [])].join('\n')}`);
  entries.sort((a, b) => identity(a.method, a.url).localeCompare(identity(b.method, b.url)));
  const protectedResources = entries.filter(infrastructureResource).map(({ method, url, kind, expectations }) => ({ method, url, kind, expectedStatus: expectations.status }));
  return { version: 1, origin, capturedAt: new Date().toISOString(), entries, sitemapUrls: [...sitemapUrls].sort(), counts: { ...counts(entries), sitemapUrls: sitemapUrls.size, unprobedResources: unprobedResources.length }, protectedResources, unprobedResources, requiresInfrastructureAudit: protectedResources.length > 0 || unprobedResources.length > 0 };
}

function assertManifest(manifest) {
  if (manifest.version !== 1 || !manifest.origin || !Array.isArray(manifest.entries) || !manifest.entries.length || !Array.isArray(manifest.sitemapUrls) || !manifest.sitemapUrls.length) throw new Error('invalid-continuity-manifest');
}

async function distFile(dist, url) {
  const route = decodeURIComponent(new URL(url).pathname);
  const root = path.resolve(dist); const filename = path.resolve(root, `.${route}`);
  if (filename !== root && !filename.startsWith(`${root}${path.sep}`)) throw new Error('dist-path-outside-root');
  for (const candidate of route.endsWith('/') ? [path.join(filename, 'index.html')] : [filename, path.join(filename, 'index.html')]) {
    try { if ((await stat(candidate)).isFile()) return { filename: candidate, body: await readFile(candidate), directoryIndex: candidate === path.join(filename, 'index.html') }; } catch (error) { if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error; }
  }
  return null;
}

function renderedCandidateUrl(file, url) {
  const parsed = new URL(url);
  if (file.directoryIndex && !parsed.pathname.endsWith('/') && !parsed.pathname.startsWith('/api/')) parsed.pathname += '/';
  return parsed.href;
}

function directoryRedirectEvidence(entry, file, target, dist) {
  const rendered = renderedCandidateUrl(file, target);
  if (rendered === target) return null;
  const observed = entry?.redirects?.find((redirect) => redirect.status === 301 && redirect.from === target && redirect.to === rendered);
  return { method: 'GET', status: 301, from: target, to: rendered, contract: 'nginx-directory-index', candidateFile: path.relative(path.resolve(dist), file.filename).split(path.sep).join('/'), observedBaselineStatus: observed?.status || null, requiresInfrastructureAudit: true };
}

async function redirectMap(dist, origin) {
  let body; try { body = await readFile(path.join(dist, '_newsletter-redirects.map'), 'utf8'); } catch (error) { if (error.code === 'ENOENT') return new Map(); throw error; }
  const redirects = new Map();
  for (const line of body.split(/\r?\n/).map((value) => value.trim()).filter((value) => value && !value.startsWith('#'))) {
    const match = line.match(/^"([^"\s]+)"\s+"([^"\s]+)";$/);
    if (!match) throw new Error(`invalid-newsletter-redirect:${line}`);
    const source = normalizeResourceUrl(match[1], `${origin}/`, origin); const target = normalizeResourceUrl(match[2], `${origin}/`, origin);
    if (!source || !target || redirects.has(resourcePath(source))) throw new Error(`invalid-or-duplicate-newsletter-redirect:${line}`);
    redirects.set(resourcePath(source), target);
  }
  return redirects;
}

function redirectTarget(url, redirects) {
  const visited = new Set(); let current = url;
  while (redirects.has(resourcePath(current))) {
    if (visited.has(current)) throw new Error(`redirect-cycle:${url}`);
    visited.add(current); current = redirects.get(resourcePath(current));
  }
  return current;
}

function compareContent(entry, body, url, origin) {
  const errors = []; const value = body.toString('utf8');
  if (entry.expectations.sha256 && hash(body) !== entry.expectations.sha256) errors.push(entry.kind === 'asset' ? 'asset-bytes-changed' : 'document-bytes-changed');
  if (entry.expectations.html) errors.push(...compareHtml(entry.expectations, value, url, origin));
  for (const marker of entry.expectations.requiredMarkers || []) if (!value.includes(marker)) errors.push(`document-marker-lost:${marker}`);
  if (entry.expectations.robotsPolicy) {
    const actual = robotsPolicy(value);
    for (const [agent, rules] of Object.entries(entry.expectations.robotsPolicy)) if (JSON.stringify(actual[agent]) !== JSON.stringify(rules)) errors.push(`robots-policy-changed:${agent}`);
  }
  if (entry.method === 'GET') errors.push(...validateDynamic(url, value));
  return errors;
}

export async function validateCandidate(manifest, dist) {
  assertManifest(manifest); const failures = []; const automaticDirectoryRedirects = []; const origin = manifest.origin; let redirects;
  try { redirects = await redirectMap(dist, origin); } catch (error) { failures.push(error.message); redirects = new Map(); }
  const sitemapUrls = new Set(); const seen = new Set(); const queue = [`${origin}/sitemap-index.xml`];
  while (queue.length) {
    const url = queue.shift(); if (seen.has(url)) continue; seen.add(url);
    try {
      const file = await distFile(dist, url); if (!file) throw new Error('missing-sitemap');
      const links = sitemapLinks(file.body.toString('utf8'), url, origin);
      if (links.type === 'sitemapindex') queue.push(...links.urls); else for (const item of links.urls) sitemapUrls.add(resourcePath(item));
    } catch (error) { failures.push(`${url}: ${error.message}`); }
  }
  for (const url of manifest.sitemapUrls) {
    try { const target = redirectTarget(url, redirects); if (!sitemapUrls.has(resourcePath(url)) && !(target !== url && sitemapUrls.has(resourcePath(target)) && await distFile(dist, target))) failures.push(`${url}: sitemap-url-lost`); } catch (error) { failures.push(error.message); }
  }
  const protectedResources = manifest.entries.filter(infrastructureResource).map(({ method, url, kind }) => ({ method, url, kind }));
  for (const entry of manifest.entries) {
    if (infrastructureResource(entry)) continue;
    try {
      const target = redirectTarget(entry.url, redirects);
      const file = await distFile(dist, target);
      if (!file) { failures.push(`${identity(entry.method, entry.url)}: missing-route`); continue; }
      const rendered = renderedCandidateUrl(file, target);
      const directoryRedirect = directoryRedirectEvidence(entry, file, target, dist);
      if (directoryRedirect) automaticDirectoryRedirects.push(directoryRedirect);
      if (entry.redirects.length && target === entry.url && entry.finalUrl !== rendered) failures.push(`${entry.url}: baseline-redirect-not-preserved`);
      failures.push(...compareContent(entry, file.body, rendered, origin).map((error) => `${identity(entry.method, entry.url)}: ${error}`));
    } catch (error) { failures.push(`${entry.url}: ${error.message}`); }
  }
  for (const [source, target] of redirects) {
    try { if (!await distFile(dist, redirectTarget(target, redirects))) failures.push(`${source}: redirect-target-missing`); } catch (error) { failures.push(error.message); }
  }
  return { ok: !failures.length, mode: 'candidate-static', checkedAt: new Date().toISOString(), failures: [...new Set(failures)].sort(), counts: { checked: manifest.entries.length - protectedResources.length, sitemapUrls: sitemapUrls.size, protectedResources: protectedResources.length, automaticDirectoryRedirects: automaticDirectoryRedirects.length }, requiresInfrastructureAudit: protectedResources.length > 0 || automaticDirectoryRedirects.length > 0 || (manifest.unprobedResources || []).length > 0, protectedResources, automaticDirectoryRedirects, unprobedResources: manifest.unprobedResources || [] };
}

export async function verifyEditions(contract, dist) {
  const failures = []; let checkedPages = 0;
  const required = contract?.editionsRequired;
  const report = () => ({ ok: !failures.length, mode: 'required-editorial-editions', kind: contract?.kind || 'daily', base: contract?.base || null, head: contract?.head || null, checkedAt: new Date().toISOString(), counts: { editions: Array.isArray(required) ? required.length : 0, pages: checkedPages }, failures: [...new Set(failures)].sort() });
  if (!Array.isArray(required)) { failures.push('invalid-editions-required-contract'); return report(); }
  if (!required.length) {
    if (contract.kind !== 'setup') failures.push('daily-editions-required-empty');
    return report();
  }
  let origin;
  try { origin = new URL(contract.origin || required[0]?.pt?.url || 'https://produtocomia.com.br', 'https://produtocomia.com.br').origin; } catch { failures.push('invalid-editions-origin'); return report(); }
  const sitemap = new Set(); const seen = new Set(); const queue = [`${origin}/sitemap-index.xml`];
  while (queue.length) {
    const url = queue.shift(); if (seen.has(url)) continue; seen.add(url);
    try {
      const file = await distFile(dist, url); if (!file) throw new Error('missing-sitemap');
      const links = sitemapLinks(file.body.toString('utf8'), url, origin);
      if (links.type === 'sitemapindex') queue.push(...links.urls); else for (const item of links.urls) sitemap.add(item);
    } catch (error) { failures.push(`${url}: ${error.message}`); }
  }
  let rssUrls = new Set(); let llmsUrls = new Set();
  try {
    const file = await distFile(dist, `${origin}/rss.xml`); if (!file) throw new Error('missing-rss');
    const $ = cheerio.load(file.body.toString('utf8'), { xmlMode: true });
    if (!$('rss').length) throw new Error('invalid-rss');
    rssUrls = new Set($('item > link').toArray().map((node) => normalizeResourceUrl($(node).text().trim(), `${origin}/`, origin)).filter(Boolean));
  } catch (error) { failures.push(`edition-rss-contract:${error.message}`); }
  try {
    const file = await distFile(dist, `${origin}/llms-full.txt`); if (!file) throw new Error('missing-llms-full');
    llmsUrls = new Set([...file.body.toString('utf8').matchAll(/https?:\/\/[^\s<>\])]+/g)].map((match) => normalizeResourceUrl(match[0], `${origin}/`, origin)).filter(Boolean));
  } catch (error) { failures.push(`edition-llms-contract:${error.message}`); }
  const editionUrls = new Set();
  for (const edition of required) {
    if (!edition || typeof edition.file !== 'string' || !edition.file || !/^\d{4}-\d{2}-\d{2}$/.test(edition.date || '') || !Number.isFinite(Date.parse(`${edition.date}T12:00:00Z`)) || new Date(`${edition.date}T12:00:00Z`).toISOString().slice(0, 10) !== edition.date) { failures.push('invalid-edition-source-contract'); continue; }
    const paths = {};
    for (const [key, prefix] of [['pt', '/newsletter/'], ['en', '/en/newsletter/']]) {
      const entry = edition[key]; const url = normalizeResourceUrl(entry?.url, `${origin}/`, origin);
      if (!entry || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.seoSlug || '') || url !== `${origin}${prefix}${entry.seoSlug}/`) { failures.push(`${edition.file}: invalid-edition-url-contract:${key}`); continue; }
      paths[key] = url;
      if (editionUrls.has(url)) failures.push(`${url}: duplicate-required-edition-url`);
      editionUrls.add(url);
    }
    for (const [key, lang] of [['pt', 'pt-BR'], ['en', 'en']]) {
      const url = paths[key]; if (!url) continue;
      if (!sitemap.has(url)) failures.push(`${url}: edition-sitemap-url-missing`);
      if (!llmsUrls.has(url)) failures.push(`${url}: edition-llms-url-missing`);
      if (key === 'pt' && !rssUrls.has(url)) failures.push(`${url}: edition-rss-url-missing`);
      try {
        const file = await distFile(dist, url); if (!file) throw new Error('missing-edition-page');
        checkedPages++;
        const body = file.body.toString('utf8'); const page = htmlContract(body, url, origin);
        if (!file.filename.endsWith('.html') || !page.expectations.hasMain || !page.expectations.hasH1 || !page.expectations.semanticText) failures.push(`${url}: edition-article-content-missing`);
        if (page.metadata.canonical !== url) failures.push(`${url}: edition-canonical-mismatch`);
        if (page.metadata.lang !== lang) failures.push(`${url}: edition-language-mismatch`);
        for (const [alternateKey, alternateLang] of [['pt', 'pt-BR'], ['en', 'en']]) if (!paths[alternateKey] || !page.metadata.alternateUrls.some((alternate) => alternate.lang === alternateLang && alternate.url === paths[alternateKey])) failures.push(`${url}: edition-hreflang-mismatch:${alternateLang}`);
        if (robotsRestrictions(page.metadata.robots).includes('noindex')) failures.push(`${url}: edition-not-indexable`);
        const $ = cheerio.load(body); const published = $('meta[property="article:published_time"]').first().attr('content');
        if (published && !published.startsWith(edition.date)) failures.push(`${url}: edition-published-date-mismatch`);
      } catch (error) { failures.push(`${url}: ${error.message} (source: ${edition.file})`); }
    }
  }
  return report();
}

// Capture expectations from an already validated build, so verification proves
// that new pages and bundles were actually deployed along with the old corpus.
export async function expectedCandidateManifest(baseline, dist) {
  const candidate = await validateCandidate(baseline, dist);
  if (!candidate.ok) throw new Error(`candidate-unhealthy\n${candidate.failures.join('\n')}`);
  if ((baseline.unprobedResources || []).length) throw new Error('candidate-unprobed-public-contracts');
  const origin = baseline.origin; const redirects = await redirectMap(dist, origin);
  const entries = new Map(baseline.entries.map((entry) => [identity(entry.method, entry.url), structuredClone(entry)]));
  const seen = new Set(); const queue = []; const sitemapUrls = new Set();
  const knownMime = new Map(baseline.entries.filter((entry) => entry.kind === 'asset').map((entry) => [path.extname(new URL(entry.url).pathname).toLowerCase(), entry.expectations.contentType]));
  const defaults = { '.js': 'application/javascript', '.mjs': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain' };
  const add = (value, method = 'GET', source = 'candidate-reference', sitemap = false) => {
    const url = normalizeResourceUrl(value, `${origin}/`, origin); if (!url) return;
    const key = identity(method, url); if (seen.has(key)) return; seen.add(key);
    const route = new URL(url).pathname;
    if (method !== 'GET' || route.startsWith('/api/') || route.startsWith('/downloads/') || route.startsWith('/cdn-cgi/')) {
      if (!entries.has(key) || !infrastructureResource(entries.get(key))) throw new Error(`candidate-unprobed-public-contract:${key}`);
      return;
    }
    queue.push({ url, source, sitemap });
  };
  add('/sitemap-index.xml', 'GET', 'candidate-sitemap-root', true);
  for (const entry of baseline.entries) if (!infrastructureResource(entry)) add(entry.url, entry.method, 'baseline-preservation', entry.kind === 'sitemap');
  while (queue.length) {
    const item = queue.shift(); const key = identity('GET', item.url); const prior = entries.get(key);
    const target = redirectTarget(item.url, redirects); const file = await distFile(dist, target);
    if (!file) throw new Error(`candidate-resource-missing:${item.url}`);
    const rendered = renderedCandidateUrl(file, target);
    const directoryRedirect = directoryRedirectEvidence(prior, file, target, dist);
    const bodyText = file.body.toString('utf8'); const route = new URL(target).pathname;
    const kind = item.sitemap ? 'sitemap' : prior?.kind || (file.filename.endsWith('.html') ? 'page' : /(?:rss\.xml|robots\.txt|llms(?:-full)?\.txt)$/.test(route) ? 'machine-document' : 'asset');
    let expectations = { status: 200, contentType: prior?.expectations.contentType || (kind === 'page' ? 'text/html' : knownMime.get(path.extname(route).toLowerCase()) || defaults[path.extname(route).toLowerCase()] || 'application/octet-stream'), ...(prior?.expectations.xRobotsTag !== undefined ? { xRobotsTag: prior.expectations.xRobotsTag } : {}) };
    let metadata;
    if (kind === 'sitemap') {
      const links = sitemapLinks(bodyText, target, origin); expectations.sitemapType = links.type;
      for (const url of links.urls) {
        if (links.type === 'urlset') sitemapUrls.add(url);
        add(url, 'GET', item.url, links.type === 'sitemapindex');
      }
    } else if (kind === 'page') {
      const contract = htmlContract(bodyText, rendered, origin);
      if (contract.expectations.hasArticleBody && !contract.expectations.semanticText) throw new Error(`candidate-empty-article-body:${item.url}`);
      expectations = { ...expectations, ...contract.expectations, metadata: contract.metadata }; metadata = contract.metadata;
      if (/^\/(?:en\/)?newsletter\/[^/]+\/$/.test(new URL(rendered).pathname)) expectations.indexable = true;
      for (const resource of contract.resources) add(resource.url, resource.method, item.url, /\/sitemap[^/]*\.xml$/.test(new URL(resource.url).pathname));
    } else if (kind === 'asset') {
      expectations.sha256 = hash(file.body); expectations.bytes = file.body.length;
      if (/\.(?:m?js|css)$/.test(route)) for (const url of literalResources(bodyText, target, origin)) add(url, SAFE_POSTS.has(new URL(url).pathname) ? 'POST' : 'GET', item.url);
    } else {
      expectations = { ...prior?.expectations, ...expectations };
      if (kind === 'machine-document' && /(?:rss\.xml|llms(?:-full)?\.txt)$/.test(route)) { expectations.sha256 = hash(file.body); expectations.bytes = file.body.length; }
    }
    const explicitRedirect = target !== item.url;
    const candidateRedirects = explicitRedirect ? [{ status: 301, from: item.url, to: target }] : prior?.redirects || [];
    if (directoryRedirect && !candidateRedirects.some((redirect) => redirect.from === target && redirect.to === rendered)) candidateRedirects.push({ status: 301, from: target, to: rendered });
    entries.set(key, { method: 'GET', url: item.url, finalUrl: rendered, status: explicitRedirect || directoryRedirect ? 301 : prior?.status || 200, finalStatus: 200, redirects: candidateRedirects, kind, source: item.source, expectations, ...(metadata ? { metadata } : {}), ...(directoryRedirect ? { directoryRedirect } : {}) });
  }
  const newsletterUrls = [...sitemapUrls].filter((url) => /^\/(?:en\/)?newsletter\/[^/]+\/$/.test(new URL(url).pathname));
  const oldSitemapUrls = new Set(baseline.sitemapUrls.map(resourcePath));
  if (newsletterUrls.length) {
    const rssFile = await distFile(dist, `${origin}/rss.xml`); const fullFile = await distFile(dist, `${origin}/llms-full.txt`);
    if (!rssFile) throw new Error('candidate-rss-missing');
    if (!fullFile) throw new Error('candidate-llms-full-missing');
    const $ = cheerio.load(rssFile.body.toString('utf8'), { xmlMode: true });
    const rssUrls = new Set($('item > link').toArray().map((node) => normalizeResourceUrl($(node).text().trim(), `${origin}/`, origin)).filter(Boolean).map(resourcePath));
    const fullUrls = new Set([...fullFile.body.toString('utf8').matchAll(/https?:\/\/[^\s<>\])]+/g)].map((match) => normalizeResourceUrl(match[0], `${origin}/`, origin)).filter(Boolean).map(resourcePath));
    for (const url of newsletterUrls) {
      const route = resourcePath(url);
      if (!route.startsWith('/en/') && !oldSitemapUrls.has(route) && !rssUrls.has(route)) throw new Error(`rss-newsletter-url-missing:${url}`);
      if (!fullUrls.has(route)) throw new Error(`llms-newsletter-url-missing:${url}`);
    }
  }
  const allEntries = [...entries.values()].sort((a, b) => identity(a.method, a.url).localeCompare(identity(b.method, b.url)));
  return { version: 1, purpose: 'expected-candidate', origin, capturedAt: new Date().toISOString(), baselineCapturedAt: baseline.capturedAt, entries: allEntries, sitemapUrls: [...sitemapUrls].sort(), counts: { ...counts(allEntries), sitemapUrls: sitemapUrls.size, unprobedResources: 0 }, protectedResources: allEntries.filter(infrastructureResource).map(({ method, url, kind, expectations }) => ({ method, url, kind, expectedStatus: expectations.status })), unprobedResources: [], requiresInfrastructureAudit: allEntries.some(infrastructureResource) };
}

export async function verifyManifest(manifest, inputOrigin, options = {}) {
  assertManifest(manifest); const origin = new URL(inputOrigin).origin; const failures = []; const results = new Map();
  const mapUrl = (url) => `${origin}${resourcePath(url)}`;
  const concurrency = Math.max(1, Math.min(options.concurrency || 6, 12));
  for (let start = 0; start < manifest.entries.length; start += concurrency) {
    await Promise.all(manifest.entries.slice(start, start + concurrency).map(async (entry) => {
      const url = mapUrl(entry.url); const label = identity(entry.method, url);
      try {
        const result = await requestResource(url, entry.method, options);
        if (entry.method === 'GET') results.set(resourcePath(entry.url), result);
        if (result.finalStatus !== entry.expectations.status) failures.push(`${label}: unexpected-status:${result.finalStatus}`);
        if (entry.method === 'POST' && result.redirects.length) failures.push(`${label}: post-contract-redirected`);
        if (entry.directoryRedirect && !result.redirects.some((redirect) => redirect.status === 301 && resourcePath(redirect.from) === resourcePath(entry.directoryRedirect.from) && resourcePath(redirect.to) === resourcePath(entry.directoryRedirect.to))) failures.push(`${label}: directory-redirect-status-changed`);
        if (['asset', 'edge-resource'].includes(entry.kind) && result.contentType !== entry.expectations.contentType) failures.push(`${label}: asset-content-type-changed`);
        if (entry.kind === 'edge-resource' && !result.body.length) failures.push(`${label}: edge-script-unhealthy`);
        if (entry.expectations.html && !result.contentType.includes('html')) failures.push(`${label}: expected-html-content-type`);
        if (entry.expectations.noStore && !/(?:^|[,\s])no-store(?:$|[,\s])/i.test(result.cacheControl)) failures.push(`${label}: protected-cache-policy:missing-no-store`);
        if (entry.expectations.xRobotsTag !== undefined && stableJson(robotsRestrictions(entry.expectations.xRobotsTag)) !== stableJson(robotsRestrictions(result.xRobotsTag))) failures.push(`${label}: http-robots-restrictions-changed`);
        if (entry.expectations.indexable && robotsRestrictions(result.xRobotsTag).includes('noindex')) failures.push(`${label}: edition-http-not-indexable`);
        failures.push(...compareContent(entry, result.body, result.finalUrl, origin).map((error) => `${label}: ${error}`));
        if (entry.kind === 'sitemap') sitemapLinks(result.body.toString('utf8'), `${manifest.origin}${resourcePath(result.finalUrl)}`, manifest.origin);
        if (entry.kind !== 'edge-resource' && entry.redirects.length && resourcePath(result.finalUrl) !== resourcePath(entry.finalUrl)) failures.push(`${label}: baseline-redirect-target-changed`);
      } catch (error) { failures.push(`${label}: ${error.message}`); }
    }));
    options.onProgress?.({ checked: Math.min(start + concurrency, manifest.entries.length), total: manifest.entries.length, failures: failures.length });
  }
  const sitemapUrls = new Set(); const seen = new Set(); const queue = [`${manifest.origin}/sitemap-index.xml`];
  while (queue.length) {
    const url = queue.shift(); if (seen.has(url)) continue; seen.add(url);
    try {
      const result = results.get(resourcePath(url)) || await requestResource(mapUrl(url), 'GET', options);
      if (result.finalStatus !== 200) throw new Error(`sitemap-unhealthy:${result.finalStatus}`);
      const links = sitemapLinks(result.body.toString('utf8'), url, manifest.origin);
      if (links.type === 'sitemapindex') queue.push(...links.urls); else for (const item of links.urls) sitemapUrls.add(resourcePath(item));
    } catch (error) { failures.push(`${mapUrl(url)}: ${error.message}`); }
  }
  for (const url of manifest.sitemapUrls) {
    if (sitemapUrls.has(resourcePath(url))) continue;
    const result = results.get(resourcePath(url));
    if (!result || ![301, 308].includes(result.status) || result.finalStatus !== 200 || !sitemapUrls.has(resourcePath(result.finalUrl))) failures.push(`${mapUrl(url)}: sitemap-url-lost`);
  }
  return { ok: !failures.length, mode: 'live', origin, checkedAt: new Date().toISOString(), counts: { checked: manifest.entries.length, sitemapUrls: sitemapUrls.size }, failures: [...new Set(failures)].sort(), requiresInfrastructureAudit: (manifest.unprobedResources || []).length > 0, unprobedResources: manifest.unprobedResources || [] };
}
