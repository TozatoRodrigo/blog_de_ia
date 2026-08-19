import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import * as cheerio from 'cheerio';

import { auditHtml, duplicateValues, normalizePageUrl } from './lib/audit-dist.mjs';

const ORIGIN = 'https://produtocomia.com.br';
const DIST = path.resolve('dist');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function fileUrl(file) {
  let relative = path.relative(DIST, file).split(path.sep).join('/');
  if (relative === 'index.html') return `${ORIGIN}/`;
  if (relative.endsWith('/index.html')) relative = relative.slice(0, -'index.html'.length);
  return new URL(relative, `${ORIGIN}/`).toString();
}

const requiredFiles = [
  'robots.txt', 'rss.xml', 'sitemap-index.xml', 'sitemap-0.xml', 'llms.txt', 'llms-full.txt',
  '_newsletter-redirects.map',
];
const missingFiles = requiredFiles.filter((file) => !existsSync(path.join(DIST, file)));
const privateAssetsLeaked = existsSync(path.join(DIST, 'downloads'));
const allFiles = await walk(DIST);
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));
const editorialIndexMinimums = new Map([
  ['/conceitos/', 180], ['/correcoes/', 180], ['/guias/', 180], ['/topicos/', 180],
  ['/en/concepts/', 180], ['/en/corrections/', 180], ['/en/guides/', 180], ['/en/topics/', 180],
]);
const pages = [];
const errors = missingFiles.map((file) => `${file}: missing-required-file`);
if (privateAssetsLeaked) errors.push('downloads: private-assets-leaked');
const warnings = [];

if (existsSync(path.join(DIST, 'robots.txt'))) {
  const robots = await readFile(path.join(DIST, 'robots.txt'), 'utf8');
  for (const rule of ['Disallow: /downloads/', 'Disallow: /api/download-leads/']) {
    if (!robots.includes(rule)) errors.push(`robots.txt: missing-${rule}`);
  }
}

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const expectedUrl = fileUrl(file);
  const $ = cheerio.load(html);
  const noindex = /noindex/i.test($('meta[name="robots"]').attr('content') || '');
  const pathname = new URL(expectedUrl).pathname;
  const isConcept = pathname.startsWith('/conceitos/') || pathname.startsWith('/en/concepts/');
  const editorialMinimum = editorialIndexMinimums.get(pathname);
  const result = auditHtml({
    html,
    expectedUrl,
    requireCanonical: !noindex,
    requireHreflang: !noindex,
    minWords: editorialMinimum || (isConcept ? 200 : 0),
  });
  errors.push(...result.errors.map((error) => `${expectedUrl}: ${error}`));
  if (!noindex) warnings.push(...result.warnings.map((warning) => `${expectedUrl}: ${warning}`));
  pages.push({ expectedUrl, $, noindex, ...result.metrics });
}

const indexablePages = pages.filter((page) => !page.noindex);
for (const duplicate of duplicateValues(indexablePages.map((page) => ({
  url: page.expectedUrl,
  value: page.title,
})))) {
  errors.push(`duplicate-title "${duplicate.value}": ${duplicate.urls.join(', ')}`);
}
for (const duplicate of duplicateValues(indexablePages.map((page) => ({
  url: page.expectedUrl,
  value: page.description,
})))) {
  errors.push(`duplicate-description "${duplicate.value}": ${duplicate.urls.join(', ')}`);
}

const knownPages = new Set(pages.map((page) => normalizePageUrl(page.expectedUrl)));
const inbound = new Map([...knownPages].map((url) => [url, 0]));

for (const page of pages) {
  const links = new Set(
    page.$('a[href]')
      .toArray()
      .map((element) => page.$(element).attr('href'))
      .filter((href) => href && !href.startsWith('mailto:') && !href.startsWith('tel:'))
      .map((href) => normalizePageUrl(href))
      .filter(Boolean),
  );

  for (const link of links) {
    if (!knownPages.has(link)) {
      const pathname = new URL(link).pathname;
      if (pathname.startsWith('/downloads/')) continue;
      const staticFile = path.join(DIST, pathname.replace(/^\//, ''));
      if (!existsSync(staticFile)) errors.push(`${page.expectedUrl}: broken-link ${link}`);
      continue;
    }
    if (link !== normalizePageUrl(page.expectedUrl)) inbound.set(link, inbound.get(link) + 1);
  }
}

const orphaned = [...inbound.entries()]
  .filter(([url, count]) => count === 0 && url !== `${ORIGIN}/` && url !== `${ORIGIN}/404.html`)
  .map(([url]) => url);

errors.push(...orphaned.map((url) => `${url}: orphan-page`));

for (const file of ['sitemap-0.xml', 'rss.xml', 'llms.txt', 'llms-full.txt']) {
  if (!existsSync(path.join(DIST, file))) continue;
  const content = await readFile(path.join(DIST, file), 'utf8');
  if (/\/(?:en\/)?newsletter\/\d{4}-\d{2}-\d{2}-/.test(content)) {
    errors.push(`${file}: dated-newsletter-url-exposed`);
  }
}

for (const page of pages) {
  if (/\/(?:en\/)?newsletter\/\d{4}-\d{2}-\d{2}-/.test(new URL(page.expectedUrl).pathname)) {
    errors.push(`${page.expectedUrl}: dated-newsletter-page-exposed`);
  }
}

console.log(`SEO audit: ${pages.length} HTML pages, ${errors.length} errors, ${warnings.length} warnings.`);
for (const warning of warnings) console.log(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length > 0) process.exitCode = 1;
