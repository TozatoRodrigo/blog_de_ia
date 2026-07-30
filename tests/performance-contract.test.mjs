import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const [baseLayout, seo, globalCss, astroConfig, nginx] = await Promise.all([
  readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/SEO.astro', import.meta.url), 'utf8'),
  readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8'),
  readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../deploy/nginx.conf', import.meta.url), 'utf8'),
]);

test('global rendering avoids layout-shifting third parties and main-thread scroll work', async () => {
  assert.doesNotMatch(baseLayout, /adsbygoogle|pagead2\.googlesyndication/);
  assert.doesNotMatch(seo, /fonts\.googleapis|fonts\.gstatic/);
  assert.match(seo, /rel="preload"[^>]+\/fonts\/archivo-black/);
  assert.match(globalCss, /font-display:\s*optional/);
  assert.match(globalCss, /transform:\s*scaleX/);
  assert.match(baseLayout, /requestAnimationFrame/);
  assert.match(astroConfig, /prefetchAll:\s*false/);
  assert.doesNotMatch(nginx, /googlesyndication|fonts\.googleapis|fonts\.gstatic/);

  const fonts = [
    '../public/fonts/archivo-black-latin-400-normal.woff2',
    '../public/fonts/inter-latin-wght-normal.woff2',
    '../public/fonts/jetbrains-mono-latin-wght-normal.woff2',
  ];
  for (const font of fonts) assert.ok((await stat(new URL(font, import.meta.url))).size > 1000);
});
