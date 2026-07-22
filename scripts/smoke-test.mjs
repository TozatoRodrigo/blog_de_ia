import process from 'node:process';

const origin = (process.argv[2] || 'https://produtocomia.com.br').replace(/\/$/, '');
const checks = [
  ['/', 200, 'Inteligência Artificial'], ['/en/', 200, 'Artificial Intelligence'],
  ['/guias/inteligencia-artificial-para-product-managers/', 200, '<h1'],
  ['/guias/gestao-de-produtos-com-ia/', 200, '<h1'], ['/guias/governanca-de-ia/', 200, '<h1'],
  ['/newsletter/', 200, '<h1'], ['/sitemap-index.xml', 200, '<sitemapindex'],
  ['/rss.xml', 200, '<rss'], ['/robots.txt', 200, 'GPTBot'], ['/llms.txt', 200, '# Produto com IA'],
  ['/llms-full.txt', 200, 'corpus editorial'],
  ['/rota-que-nao-existe-seo-check', 404, '404'],
];

let failures = 0;
for (const [path, expectedStatus, expectedText] of checks) {
  const response = await fetch(`${origin}${path}`, { redirect: 'follow' });
  const text = await response.text();
  if (response.status !== expectedStatus || (expectedText && !text.includes(expectedText))) {
    console.error(`FAIL ${path}: status ${response.status}; expected ${expectedStatus} and ${JSON.stringify(expectedText)}`);
    failures += 1;
  } else console.log(`PASS ${path}`);
}

const guide = await fetch(`${origin}/guias/governanca-de-ia/`).then((response) => response.text());
if (!guide.includes('<link rel="canonical" href="https://produtocomia.com.br/guias/governanca-de-ia/"')) {
  console.error('FAIL guide canonical'); failures += 1;
}
const home = await fetch(`${origin}/`).then((response) => response.text());
const assetPath = home.match(/src="(\/_astro\/[^"?]+\.js)"/)?.[1];
if (!assetPath) { console.error('FAIL JavaScript asset reference'); failures += 1; }
else {
  const asset = await fetch(`${origin}${assetPath}?smoke=${Date.now()}`);
  if (!asset.ok) { console.error(`FAIL ${assetPath}: status ${asset.status}`); failures += 1; }
  else console.log(`PASS ${assetPath}`);
}
if (failures) process.exitCode = 1;
