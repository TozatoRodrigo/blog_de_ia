import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadCatalog } from './catalog.mjs';
import { loadConfig } from './config.mjs';
import { createLeadDatabase } from './database.mjs';
import { createLeadHandler } from './http.mjs';
import { createNotifier, runNotificationBatch } from './notifier.mjs';
import { createRateLimiter } from './security.mjs';
import { createLeadWorkflow } from './workflow.mjs';

export async function createApplication({ env = process.env, fetchImpl = fetch } = {}) {
  const config = loadConfig(env);
  const catalog = await loadCatalog(config.downloadCatalogPath);
  const db = createLeadDatabase({ path: config.databasePath });
  const notifier = createNotifier({
    apiKey: config.resendApiKey,
    from: config.resendFrom,
    to: config.notificationTo,
    mode: config.notificationMode,
    fetchImpl,
  });
  const workflow = createLeadWorkflow({ config, catalog, db });
  const rateLimiter = createRateLimiter({ secret: config.cookieSecret });
  const server = createServer(createLeadHandler({ config, catalog, workflow, rateLimiter }));
  const timers = new Set();
  let closed = false;

  async function runNotifications() {
    return runNotificationBatch({ db, notifier, catalog, limit: 20 });
  }

  async function start() {
    await workflow.health();
    await runNotifications();
    await new Promise((resolveStart, reject) => {
      server.once('error', reject);
      server.listen(config.port, '0.0.0.0', () => {
        server.off('error', reject);
        resolveStart();
      });
    });

    const notificationTimer = setInterval(() => {
      runNotifications().catch(() => {});
    }, 60_000);
    notificationTimer.unref();
    timers.add(notificationTimer);

    const cleanupTimer = setInterval(() => {
      db.purgeExpired();
      const cutoff = new Date(Date.now() - config.retentionDays * 86_400_000).toISOString();
      db.purgeOlderThan(cutoff);
    }, 86_400_000);
    cleanupTimer.unref();
    timers.add(cleanupTimer);

    return server.address();
  }

  async function close() {
    if (closed) return;
    closed = true;
    for (const timer of timers) clearInterval(timer);
    timers.clear();
    if (server.listening) {
      await new Promise((resolveClose, reject) => {
        server.close((error) => error ? reject(error) : resolveClose());
      });
    }
    db.close();
  }

  return Object.freeze({ config, catalog, db, notifier, workflow, server, runNotifications, start, close });
}

async function runMain() {
  const app = await createApplication();
  await app.start();
  process.stdout.write(`download-leads listening on port ${app.config.port}\n`);

  const shutdown = async () => {
    try {
      await app.close();
      process.exitCode = 0;
    } catch {
      process.exitCode = 1;
    }
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}

const entrypoint = process.argv[1] ? resolve(process.argv[1]) : '';
if (entrypoint === fileURLToPath(import.meta.url)) {
  runMain().catch((error) => {
    process.stderr.write(`download-leads failed to start: ${error?.code ?? error?.name ?? 'unknown'}\n`);
    process.exitCode = 1;
  });
}
