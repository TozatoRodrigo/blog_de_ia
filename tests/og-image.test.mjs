import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { generateOgImage } from '../scripts/generate-og-images.mjs';

test('Open Graph generator creates a deterministic 1200x630 PNG', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'produto-og-'));
  const output = path.join(directory, 'image.png');
  await generateOgImage({ title: 'Gestão de produtos com IA', output });
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.format, 'png');
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
});
