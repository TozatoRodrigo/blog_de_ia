import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createLeadDatabase } from '../src/database.mjs';

function setup(start = '2026-07-22T12:00:00.000Z') {
  let now = new Date(start);
  let id = 0;
  const db = createLeadDatabase({
    path: ':memory:',
    clock: () => new Date(now),
    randomUUID: () => `id-${++id}`,
  });
  return {
    db,
    advance(ms) {
      now = new Date(now.getTime() + ms);
    },
  };
}

function seed(db) {
  const lead = db.upsertLead({
    email: 'pessoa@example.com',
    marketingOptIn: false,
    privacyVersion: '2026-07-22',
  });
  const event = db.createDownloadEvent({
    leadId: lead.id,
    materialId: 'ai-risk-matrix',
    sourcePath: '/en/guides/ai-risk-matrix/',
    lang: 'en',
    campaign: 'linkedin',
  });
  return { lead, event };
}

test('upserts one normalized lead and preserves an affirmative opt-in', () => {
  const { db } = setup();
  const lead = db.upsertLead({
    email: 'pessoa@example.com',
    marketingOptIn: false,
    privacyVersion: '2026-07-22',
  });
  const updated = db.upsertLead({
    email: 'pessoa@example.com',
    marketingOptIn: true,
    privacyVersion: '2026-07-22',
  });

  assert.equal(updated.id, lead.id);
  assert.equal(updated.marketingOptIn, 1);
  assert.equal(db.findLeadById(lead.id).email, 'pessoa@example.com');
  db.close();
});

test('resolves only unexpired sessions', () => {
  const { db, advance } = setup();
  const { lead } = seed(db);
  db.createSession({
    leadId: lead.id,
    tokenHash: 'session-hash',
    expiresAt: '2026-07-22T12:01:00.000Z',
  });

  assert.equal(db.findLeadBySessionHash('session-hash').email, lead.email);
  advance(61_000);
  assert.equal(db.findLeadBySessionHash('session-hash'), undefined);
  db.close();
});

test('limits a download authorization to its expiry and maximum uses', () => {
  const { db, advance } = setup();
  const { event } = seed(db);
  db.createDownloadAuthorization({
    eventId: event.id,
    tokenHash: 'download-hash',
    expiresAt: '2026-07-22T12:01:00.000Z',
    maxUses: 3,
  });

  assert.equal(db.consumeDownloadAuthorization('download-hash').uses, 1);
  assert.equal(db.consumeDownloadAuthorization('download-hash').uses, 2);
  assert.equal(db.consumeDownloadAuthorization('download-hash').uses, 3);
  assert.equal(db.consumeDownloadAuthorization('download-hash'), undefined);

  db.createDownloadAuthorization({
    eventId: event.id,
    tokenHash: 'expiring-hash',
    expiresAt: '2026-07-22T12:01:00.000Z',
    maxUses: 3,
  });
  advance(61_000);
  assert.equal(db.consumeDownloadAuthorization('expiring-hash'), undefined);
  db.close();
});

test('tracks notification retries without losing the download event', () => {
  const { db } = setup();
  const { lead, event } = seed(db);

  assert.equal(db.pendingNotifications(10)[0].id, event.id);
  assert.equal(db.findLeadById(lead.id).email, lead.email);
  db.markNotificationFailed(event.id, 'resend_http_503');
  assert.equal(db.pendingNotifications(10)[0].notificationAttempts, 1);
  assert.equal(db.pendingNotifications(10)[0].notificationLastError, 'resend_http_503');
  db.markNotificationSent(event.id);
  assert.deepEqual(db.pendingNotifications(10), []);
  db.close();
});

test('deletes a lead and cascades sessions and events', () => {
  const { db } = setup();
  const { lead } = seed(db);
  db.createSession({ leadId: lead.id, tokenHash: 'hash', expiresAt: '2030-01-01T00:00:00.000Z' });

  assert.equal(db.deleteLeadByEmail(lead.email), true);
  assert.equal(db.findLeadById(lead.id), undefined);
  assert.equal(db.findLeadBySessionHash('hash'), undefined);
  assert.deepEqual(db.pendingNotifications(10), []);
  db.close();
});

test('creates a consistent online backup', async () => {
  const { db } = setup();
  seed(db);
  const directory = await mkdtemp(join(tmpdir(), 'lead-db-'));
  const backupPath = join(directory, 'backup.sqlite');

  await db.backupTo(backupPath);
  assert.ok((await readFile(backupPath)).length > 100);
  db.close();
});
