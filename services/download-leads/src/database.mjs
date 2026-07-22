import { DatabaseSync } from 'node:sqlite';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  marketing_opt_in INTEGER NOT NULL DEFAULT 0,
  privacy_version TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS download_events (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  material_id TEXT NOT NULL,
  source_path TEXT NOT NULL,
  lang TEXT NOT NULL,
  campaign TEXT,
  created_at TEXT NOT NULL,
  notification_state TEXT NOT NULL DEFAULT 'pending',
  notification_attempts INTEGER NOT NULL DEFAULT 0,
  notification_last_error TEXT,
  notification_sent_at TEXT
);
CREATE TABLE IF NOT EXISTS download_authorizations (
  token_hash TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES download_events(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  uses INTEGER NOT NULL DEFAULT 0,
  max_uses INTEGER NOT NULL DEFAULT 3,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_events_notification ON download_events(notification_state, created_at);
CREATE INDEX IF NOT EXISTS idx_authorizations_expiry ON download_authorizations(expires_at);
`;

function leadFromRow(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    email: row.email,
    marketingOptIn: row.marketing_opt_in,
    privacyVersion: row.privacy_version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function eventFromRow(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    leadId: row.lead_id,
    materialId: row.material_id,
    sourcePath: row.source_path,
    lang: row.lang,
    campaign: row.campaign,
    createdAt: row.created_at,
    notificationState: row.notification_state,
    notificationAttempts: row.notification_attempts,
    notificationLastError: row.notification_last_error,
    notificationSentAt: row.notification_sent_at,
  };
}

export function createLeadDatabase({ path, clock = () => new Date(), randomUUID = crypto.randomUUID }) {
  const database = new DatabaseSync(path, { timeout: 5_000 });
  database.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL;');
  database.exec(SCHEMA);

  const statements = {
    upsertLead: database.prepare(`
      INSERT INTO leads (id, email, marketing_opt_in, privacy_version, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        marketing_opt_in = MAX(leads.marketing_opt_in, excluded.marketing_opt_in),
        privacy_version = excluded.privacy_version,
        updated_at = excluded.updated_at
      RETURNING *
    `),
    findLeadById: database.prepare('SELECT * FROM leads WHERE id = ?'),
    createSession: database.prepare(`
      INSERT INTO sessions (token_hash, lead_id, expires_at, created_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(token_hash) DO UPDATE SET lead_id = excluded.lead_id, expires_at = excluded.expires_at
    `),
    findLeadBySession: database.prepare(`
      SELECT leads.* FROM sessions
      JOIN leads ON leads.id = sessions.lead_id
      WHERE sessions.token_hash = ? AND sessions.expires_at > ?
    `),
    createEvent: database.prepare(`
      INSERT INTO download_events
        (id, lead_id, material_id, source_path, lang, campaign, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `),
    createAuthorization: database.prepare(`
      INSERT INTO download_authorizations
        (token_hash, event_id, expires_at, max_uses, created_at)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `),
    findAuthorization: database.prepare(`
      SELECT download_authorizations.*, download_events.material_id, download_events.lead_id
      FROM download_authorizations
      JOIN download_events ON download_events.id = download_authorizations.event_id
      WHERE token_hash = ? AND expires_at > ? AND uses < max_uses
    `),
    incrementAuthorization: database.prepare(`
      UPDATE download_authorizations SET uses = uses + 1 WHERE token_hash = ?
      RETURNING uses
    `),
    pendingNotifications: database.prepare(`
      SELECT * FROM download_events
      WHERE notification_state IN ('pending', 'failed') AND notification_attempts < 8
      ORDER BY created_at ASC LIMIT ?
    `),
    notificationSent: database.prepare(`
      UPDATE download_events
      SET notification_state = 'sent', notification_sent_at = ?, notification_last_error = NULL
      WHERE id = ?
    `),
    notificationFailed: database.prepare(`
      UPDATE download_events
      SET notification_state = 'failed', notification_attempts = notification_attempts + 1,
          notification_last_error = ?
      WHERE id = ?
    `),
    deleteLead: database.prepare('DELETE FROM leads WHERE email = ?'),
    purgeSessions: database.prepare('DELETE FROM sessions WHERE expires_at <= ?'),
    purgeAuthorizations: database.prepare('DELETE FROM download_authorizations WHERE expires_at <= ?'),
    purgeLeads: database.prepare('DELETE FROM leads WHERE updated_at < ?'),
  };

  function nowIso() {
    return clock().toISOString();
  }

  function transaction(operation) {
    database.exec('BEGIN IMMEDIATE');
    try {
      const result = operation();
      database.exec('COMMIT');
      return result;
    } catch (error) {
      database.exec('ROLLBACK');
      throw error;
    }
  }

  return Object.freeze({
    upsertLead({ email, marketingOptIn, privacyVersion }) {
      const now = nowIso();
      return leadFromRow(
        statements.upsertLead.get(
          randomUUID(),
          email,
          marketingOptIn ? 1 : 0,
          privacyVersion,
          now,
          now,
        ),
      );
    },

    findLeadById(id) {
      return leadFromRow(statements.findLeadById.get(id));
    },

    createSession({ leadId, tokenHash, expiresAt }) {
      statements.createSession.run(tokenHash, leadId, expiresAt, nowIso());
      return { leadId, tokenHash, expiresAt };
    },

    findLeadBySessionHash(tokenHash) {
      return leadFromRow(statements.findLeadBySession.get(tokenHash, nowIso()));
    },

    createDownloadEvent({ leadId, materialId, sourcePath, lang, campaign = null }) {
      return eventFromRow(
        statements.createEvent.get(
          randomUUID(),
          leadId,
          materialId,
          sourcePath,
          lang,
          campaign,
          nowIso(),
        ),
      );
    },

    createDownloadAuthorization({ eventId, tokenHash, expiresAt, maxUses = 3 }) {
      const row = statements.createAuthorization.get(tokenHash, eventId, expiresAt, maxUses, nowIso());
      return {
        tokenHash: row.token_hash,
        eventId: row.event_id,
        expiresAt: row.expires_at,
        uses: row.uses,
        maxUses: row.max_uses,
      };
    },

    consumeDownloadAuthorization(tokenHash) {
      return transaction(() => {
        const row = statements.findAuthorization.get(tokenHash, nowIso());
        if (!row) return undefined;
        const updated = statements.incrementAuthorization.get(tokenHash);
        return {
          tokenHash: row.token_hash,
          eventId: row.event_id,
          leadId: row.lead_id,
          materialId: row.material_id,
          expiresAt: row.expires_at,
          uses: updated.uses,
          maxUses: row.max_uses,
        };
      });
    },

    pendingNotifications(limit = 20) {
      return statements.pendingNotifications.all(limit).map(eventFromRow);
    },

    markNotificationSent(eventId) {
      statements.notificationSent.run(nowIso(), eventId);
    },

    markNotificationFailed(eventId, errorCode) {
      statements.notificationFailed.run(String(errorCode).slice(0, 120), eventId);
    },

    deleteLeadByEmail(email) {
      return Number(statements.deleteLead.run(email).changes) > 0;
    },

    purgeExpired() {
      const now = nowIso();
      return transaction(() => ({
        sessions: Number(statements.purgeSessions.run(now).changes),
        authorizations: Number(statements.purgeAuthorizations.run(now).changes),
      }));
    },

    purgeOlderThan(isoDate) {
      return Number(statements.purgeLeads.run(isoDate).changes);
    },

    backupTo(destination) {
      const escaped = String(destination).replaceAll("'", "''");
      database.exec(`VACUUM INTO '${escaped}'`);
    },

    close() {
      database.close();
    },
  });
}
