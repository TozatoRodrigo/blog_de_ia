import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import * as cheerio from 'cheerio';

import { auditHtml, normalizePageUrl } from './lib/audit-dist.mjs';

const ORIGIN = 'https://produtocomia.com.br';
const DIST = path.resolve('dist');
const downloadCatalog = JSON.parse(await readFile(path.resolve('config/downloads.json'), 'utf8'));

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
  ...downloadCatalog.map((item) => `downloads/${item.filename}`),
];
const missingFiles = requiredFiles.filter((file) => !existsSync(path.join(DIST, file)));
const allFiles = await walk(DIST);
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));
const pages = [];
const errors = missingFiles.map((file) => `${file}: missing-required-file`);
const warnings = [];

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const expectedUrl = fileUrl(file);
  const $ = cheerio.load(html);
  const noindex = /noindex/i.test($('meta[name="robots"]').attr('content') || '');
  const result = auditHtml({
    html,
    expectedUrl,
    requireCanonical: !noindex,
    requireHreflang: !noindex,
  });
  errors.push(...result.errors.map((error) => `${expectedUrl}: ${error}`));
  if (!noindex) warnings.push(...result.warnings.map((warning) => `${expectedUrl}: ${warning}`));
  pages.push({ expectedUrl, $, noindex });
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

console.log(`SEO audit: ${pages.length} HTML pages, ${errors.length} errors, ${warnings.length} warnings.`);
for (const warning of warnings) console.log(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length > 0) process.exitCode = 1;
