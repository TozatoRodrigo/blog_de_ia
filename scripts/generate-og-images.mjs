import { mkdir, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const escapeXml = (value) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);

function wrap(text, max = 31) {
  const words = text.trim().split(/\s+/); const lines = []; let line = '';
  for (const word of words) {
    if (`${line} ${word}`.trim().length > max && line) { lines.push(line); line = word; }
    else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

export async function generateOgImage({ title, eyebrow = 'PRODUTO COM IA', output }) {
  const lines = wrap(title);
  const text = lines.map((line, i) => `<text x="80" y="${250 + i * 76}" font-family="Arial, sans-serif" font-size="64" font-weight="800" fill="#111">${escapeXml(line)}</text>`).join('');
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#f4f4f0"/><rect x="0" y="0" width="24" height="630" fill="#ff3b00"/><text x="80" y="95" font-family="monospace" font-size="26" font-weight="700" fill="#ff3b00">${escapeXml(eyebrow)}</text><path d="M80 135H1120" stroke="#111" stroke-width="4"/>${text}<text x="80" y="580" font-family="monospace" font-size="22" fill="#555">produtocomia.com.br  •  IA PARA QUEM DECIDE PRODUTO</text></svg>`;
  await mkdir(path.dirname(output), { recursive: true });
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(output);
}

async function markdownTitles(directory) {
  const files = await readdir(directory); const items = [];
  for (const file of files.filter((name) => name.endsWith('.md'))) {
    const source = await readFile(path.join(directory, file), 'utf8');
    const title = source.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] || file.replace(/\.md$/, '');
    items.push({ slug: file.replace(/\.md$/, ''), title });
  }
  return items;
}

async function main() {
  await generateOgImage({ title: 'Inteligência Artificial para Product Managers', output: 'public/og/default.png' });
  for (const [directory, prefix] of [['src/content/newsletters', ''], ['src/content/newsletters-en', 'en-']]) {
    for (const item of await markdownTitles(directory)) {
      await generateOgImage({ title: item.title, eyebrow: prefix ? 'PRODUTO COM IA • ENGLISH' : 'PRODUTO COM IA • NEWSLETTER', output: `public/og/newsletter/${prefix}${item.slug}.png` });
    }
  }
  for (const directory of ['src/content/guides', 'src/content/guides-en']) {
    try {
      for (const item of await markdownTitles(directory)) await generateOgImage({ title: item.title, eyebrow: 'PRODUTO COM IA • GUIA', output: `public/og/guides/${item.slug}.png` });
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
