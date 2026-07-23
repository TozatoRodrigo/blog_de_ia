import { spawn } from 'node:child_process';

const separatorIndex = process.argv.indexOf('--');
if (separatorIndex < 0 || separatorIndex === process.argv.length - 1) {
  throw new Error('Usage: run-with-heartbeat.mjs [--label text] [--interval-ms number] -- command [args...]');
}

const optionArgs = process.argv.slice(2, separatorIndex);
const commandArgs = process.argv.slice(separatorIndex + 1);
const labelIndex = optionArgs.indexOf('--label');
const intervalIndex = optionArgs.indexOf('--interval-ms');
const label = labelIndex >= 0 ? optionArgs[labelIndex + 1] : commandArgs.join(' ');
const intervalMs = intervalIndex >= 0 ? Number(optionArgs[intervalIndex + 1]) : 30_000;

if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
  throw new Error('--interval-ms must be a positive number');
}

const startedAt = Date.now();
const child = spawn(commandArgs[0], commandArgs.slice(1), { stdio: 'inherit' });
const heartbeat = setInterval(() => {
  const elapsedSeconds = Math.round((Date.now() - startedAt) / 1000);
  console.log(`[validate] ${label} still running after ${elapsedSeconds}s...`);
}, intervalMs);

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => child.kill(signal));
}

const { code, signal } = await new Promise((resolve, reject) => {
  child.once('error', reject);
  child.once('exit', (exitCode, exitSignal) => resolve({ code: exitCode, signal: exitSignal }));
});

clearInterval(heartbeat);

if (signal) {
  console.error(`[validate] ${label} stopped by ${signal}.`);
  process.exitCode = 1;
} else {
  process.exitCode = code ?? 1;
}
