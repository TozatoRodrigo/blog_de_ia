import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadCatalog } from './catalog.mjs';
import { loadConfig } from './config.mjs';
import { createLeadDatabase } from './database.mjs';
import { createContributionWorkflow } from './contribution-workflow.mjs';
import { createLeadHandler } from './http.mjs';
import {
  createNotifier,
  runContributionNotificationBatch,
  runNotificationBatch,
} from './notifier.mjs';
import { createRateLimiter } from './security.mjs';
import { createLeadWorkflow } from './workflow.mjs';

export async function createApplication({ env = process.env, fetchImpl = fetch, logger = console } = {}) {
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
  const contributionRateLimiter = createRateLimiter({
    secret: config.cookieSecret,
    maxAttempts: config.contributionRateLimitAttempts,
  });
  // The workflow owns the canonical guard so future HTTP adapters cannot bypass it.
  const contributionWorkflow = createContributionWorkflow({
    config,
    db,
    rateLimiter: contributionRateLimiter,
  });
  const server = createServer(createLeadHandler({
    config,
    catalog,
    workflow,
    rateLimiter,
    contributionWorkflow,
    contributionRateLimiter,
  }));
  const timers = new Set();
  const activeNotificationRuns = new Set();
  let closed = false;

  function reportNotificationError(phase, error) {
    try {
      logger?.error?.(`Notification batch failed during ${phase}`, error);
    } catch {
      // Logging must not turn a handled batch failure into an unhandled rejection.
    }
  }

  function runNotifications() {
    const run = (async () => {
      let firstRejection;
      let hasRejection = false;
      const batches = [
        runNotificationBatch({ db, notifier, catalog, limit: 20 }),
        runContributionNotificationBatch({
          db,
          notifier,
          limit: 20,
          maxAttempts: config.contributionNotificationMaxAttempts,
          logger,
        }),
      ].map((batch) => batch.catch((error) => {
        if (!hasRejection) {
          hasRejection = true;
          firstRejection = error;
        }
        throw error;
      }));
      const [downloadsResult, contributionsResult] = await Promise.allSettled(batches);
      if (hasRejection) throw firstRejection;
      const downloads = downloadsResult.value;
      const contributions = contributionsResult.value;
      return {
        sent: downloads.sent + contributions.sent,
        failed: downloads.failed + contributions.failed,
      };
    })();
    activeNotificationRuns.add(run);
    run.then(
      () => activeNotificationRuns.delete(run),
      () => activeNotificationRuns.delete(run),
    );
    return run;
  }

  async function start() {
    await workflow.health();
    try {
      await runNotifications();
    } catch (error) {
      reportNotificationError('startup', error);
      throw error;
    }
    if (closed) throw new Error('Application is closed');
    await new Promise((resolveStart, reject) => {
      server.once('error', reject);
      server.listen(config.port, '0.0.0.0', () => {
        server.off('error', reject);
        resolveStart();
      });
    });

    const notificationTimer = setInterval(() => {
      void runNotifications().catch((error) => {
        reportNotificationError('timer', error);
      });
    }, 60_000);
    notificationTimer.unref();
    timers.add(notificationTimer);

    const cleanupTimer = setInterval(() => {
      db.purgeExpired();
      const cutoff = new Date(Date.now() - config.retentionDays * 86_400_000).toISOString();
      db.purgeOlderThan(cutoff);
      db.purgeEditorialSubmissions(cutoff);
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
    while (activeNotificationRuns.size > 0) {
      await Promise.allSettled([...activeNotificationRuns]);
    }
    db.close();
  }

  return Object.freeze({
    config,
    catalog,
    db,
    notifier,
    workflow,
    contributionWorkflow,
    contributionRateLimiter,
    server,
    runNotifications,
    start,
    close,
  });
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
