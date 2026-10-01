import { readFile, mkdir, writeFile, rename, link, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import { captureManifest, validateCandidate, verifyManifest, expectedCandidateManifest, verifyEditions } from './lib/newsletter-continuity.mjs';

const [command, first, second, third] = process.argv.slice(2);
let lastProgress = 0;
const onProgress = (progress) => {
  if (Date.now() - lastProgress < 15_000) return;
  lastProgress = Date.now(); process.stderr.write(`continuity ${command}: ${JSON.stringify(progress)}\n`);
};
try {
  if (!['capture', 'candidate', 'verify', 'expect-candidate', 'verify-editions'].includes(command) || !first || !second || process.argv.length !== (command === 'expect-candidate' ? 6 : 5) || (command === 'expect-candidate' && !third)) throw new Error('Usage: node scripts/newsletter-continuity.mjs capture <origin> <manifest.json> | candidate <manifest.json> <dist> | verify <manifest.json> <origin> | expect-candidate <baseline.json> <dist> <output.json> | verify-editions <contract.json> <dist>');
  if (command === 'capture') {
    const manifest = await captureManifest(first, { onProgress });
    const filename = path.resolve(second); await mkdir(path.dirname(filename), { recursive: true });
    const temporary = `${filename}.${process.pid}.tmp`;
    await writeFile(temporary, `${JSON.stringify(manifest, null, 2)}\n`); await rename(temporary, filename);
    process.stdout.write(`${JSON.stringify({ ok: true, manifest: filename, capturedAt: manifest.capturedAt, counts: manifest.counts, requiresInfrastructureAudit: manifest.requiresInfrastructureAudit }, null, 2)}\n`);
  } else if (command === 'expect-candidate') {
    const baseline = JSON.parse(await readFile(path.resolve(first), 'utf8'));
    const manifest = await expectedCandidateManifest(baseline, path.resolve(second));
    const filename = path.resolve(third); await mkdir(path.dirname(filename), { recursive: true });
    const temporary = `${filename}.${randomUUID()}.tmp`;
    await writeFile(temporary, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    try { await link(temporary, filename); } finally { await unlink(temporary); }
    process.stdout.write(`${JSON.stringify({ ok: true, manifest: filename, capturedAt: manifest.capturedAt, counts: manifest.counts, requiresInfrastructureAudit: manifest.requiresInfrastructureAudit }, null, 2)}\n`);
  } else {
    const manifest = JSON.parse(await readFile(path.resolve(first), 'utf8'));
    const result = command === 'verify-editions' ? await verifyEditions(manifest, path.resolve(second)) : command === 'candidate' ? await validateCandidate(manifest, path.resolve(second)) : await verifyManifest(manifest, second, { onProgress });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (!result.ok) process.exitCode = 1;
  }
} catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
