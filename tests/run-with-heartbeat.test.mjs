import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const scriptPath = fileURLToPath(new URL('../scripts/run-with-heartbeat.mjs', import.meta.url));

test('emits a heartbeat while a quiet validation command is still running', () => {
  const result = spawnSync(
    process.execPath,
    [
      scriptPath,
      '--label',
      'fixture check',
      '--interval-ms',
      '10',
      '--',
      process.execPath,
      '-e',
      'setTimeout(() => {}, 60)',
    ],
    { encoding: 'utf8' },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /fixture check still running/);
});
