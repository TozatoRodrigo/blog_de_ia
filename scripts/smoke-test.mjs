import process from 'node:process';

const origin = (process.argv[2] || 'https://produtocomia.com.br').replace(/\/$/, '');
const checks = [
  ['/', 200, 'Inteligência Artificial'], ['/en/', 200, 'Artificial Intelligence'],
  ['/guias/inteligencia-artificial-para-product-managers/', 200, '<h1'],
  ['/guias/gestao-de-produtos-com-ia/', 200, '<h1'], ['/guias/governanca-de-ia/', 200, '<h1'],
  ['/guias/', 200, '<h1'], ['/privacidade/', 200, '<h1'], ['/en/privacy/', 200, '<h1'],
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

const health = await fetch(`${origin}/api/download-leads/health`);
if (health.status !== 200 || (await health.json()).status !== 'ok') {
  console.error('FAIL /api/download-leads/health'); failures += 1;
} else console.log('PASS /api/download-leads/health');

const configResponse = await fetch(`${origin}/api/download-leads/config`);
const config = await configResponse.json().catch(() => ({}));
const configKeys = Object.keys(config).sort();
if (configResponse.status !== 200
  || JSON.stringify(configKeys) !== JSON.stringify(['privacyVersion', 'turnstileSiteKey'])
  || 'turnstileSecretKey' in config
  || 'TURNSTILE_SECRET_KEY' in config) {
  console.error('FAIL /api/download-leads/config exposed an invalid contract'); failures += 1;
} else console.log('PASS /api/download-leads/config');

const fallback = await fetch(`${origin}/downloads/ai-risk-matrix.csv`);
const fallbackText = await fallback.text();
if (fallback.status !== 200
  || !fallback.headers.get('content-type')?.includes('text/html')
  || !fallbackText.includes('type="email"')
  || fallbackText.includes('system_id,system_name')) {
  console.error('FAIL /downloads/ai-risk-matrix.csv is not the protected form'); failures += 1;
} else console.log('PASS /downloads/ai-risk-matrix.csv');

const invalidFile = await fetch(`${origin}/api/download-leads/file/invalid`);
if (invalidFile.status !== 404) {
  console.error(`FAIL /api/download-leads/file/invalid: status ${invalidFile.status}`); failures += 1;
} else console.log('PASS /api/download-leads/file/invalid');

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
