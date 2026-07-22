import { access } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import {
  createOpaqueToken,
  hashToken,
  isHoneypotClear,
  normalizeEmail,
  sanitizeCampaign,
  sanitizeSourcePath,
  verifyTurnstile,
} from './security.mjs';

export class LeadFlowError extends Error {
  constructor(code, status, message) {
    super(message);
    this.name = 'LeadFlowError';
    this.code = code;
    this.status = status;
  }
}

function requireMaterial(catalog, materialId) {
  const material = typeof materialId === 'string' ? catalog.byId.get(materialId) : undefined;
  if (!material) throw new LeadFlowError('material_not_found', 404, 'Material not found');
  return material;
}

function normalizeLang(value) {
  return value === 'en' ? 'en' : 'pt-BR';
}

function addMilliseconds(date, milliseconds) {
  return new Date(date.getTime() + milliseconds).toISOString();
}

export function createLeadWorkflow({
  config,
  catalog,
  db,
  verifyTurnstileFn = verifyTurnstile,
  clock = () => new Date(),
}) {
  const expectedHostname = new URL(config.allowedOrigin).hostname;

  function createEventAndAuthorization({ lead, material, sourcePath, lang, campaign }) {
    const event = db.createDownloadEvent({
      leadId: lead.id,
      materialId: material.id,
      sourcePath: sanitizeSourcePath(sourcePath),
      lang: normalizeLang(lang),
      campaign: sanitizeCampaign(campaign),
    });
    const downloadToken = createOpaqueToken();
    db.createDownloadAuthorization({
      eventId: event.id,
      tokenHash: hashToken(downloadToken, config.cookieSecret),
      expiresAt: addMilliseconds(clock(), config.authorizationSeconds * 1_000),
      maxUses: 3,
    });
    return {
      eventId: event.id,
      downloadToken,
      downloadUrl: `/api/download-leads/file/${downloadToken}`,
    };
  }

  return Object.freeze({
    async register({
      email,
      marketingOptIn,
      privacyVersion,
      materialId,
      sourcePath,
      lang,
      campaign,
      turnstileToken,
      remoteIp,
      company,
    }) {
      if (!isHoneypotClear(company)) {
        throw new LeadFlowError('invalid_submission', 400, 'Invalid submission');
      }
      if (privacyVersion !== config.privacyVersion) {
        throw new LeadFlowError('privacy_version_mismatch', 400, 'Please reload and try again');
      }
      const material = requireMaterial(catalog, materialId);
      let normalizedEmail;
      try {
        normalizedEmail = normalizeEmail(email);
      } catch {
        throw new LeadFlowError('invalid_email', 400, 'Enter a valid email');
      }
      const turnstileValid = await verifyTurnstileFn({
        token: turnstileToken,
        remoteIp,
        secret: config.turnstileSecretKey,
        expectedHostname,
        testing: config.turnstileTesting,
      });
      if (!turnstileValid) {
        throw new LeadFlowError('turnstile_failed', 400, 'Verification failed; try again');
      }

      const lead = db.upsertLead({
        email: normalizedEmail,
        marketingOptIn: marketingOptIn === true,
        privacyVersion,
      });
      const sessionToken = createOpaqueToken();
      db.createSession({
        leadId: lead.id,
        tokenHash: hashToken(sessionToken, config.cookieSecret),
        expiresAt: addMilliseconds(clock(), config.sessionDays * 86_400_000),
      });
      return {
        sessionToken,
        ...createEventAndAuthorization({ lead, material, sourcePath, lang, campaign }),
      };
    },

    authorize({ sessionToken, materialId, sourcePath, lang, campaign }) {
      const material = requireMaterial(catalog, materialId);
      if (!sessionToken) throw new LeadFlowError('unauthorized', 401, 'Email is required');
      const lead = db.findLeadBySessionHash(hashToken(sessionToken, config.cookieSecret));
      if (!lead) throw new LeadFlowError('unauthorized', 401, 'Email is required');
      return createEventAndAuthorization({ lead, material, sourcePath, lang, campaign });
    },

    async resolveFile({ downloadToken }) {
      if (!/^[A-Za-z0-9_-]{43}$/.test(downloadToken ?? '')) {
        throw new LeadFlowError('file_not_found', 404, 'File not found');
      }
      const authorization = db.consumeDownloadAuthorization(
        hashToken(downloadToken, config.cookieSecret),
      );
      if (!authorization) throw new LeadFlowError('file_not_found', 404, 'File not found');
      const material = requireMaterial(catalog, authorization.materialId);
      const base = resolve(config.downloadsDir);
      const filePath = resolve(base, material.filename);
      if (!filePath.startsWith(`${base}${sep}`)) {
        throw new LeadFlowError('file_not_found', 404, 'File not found');
      }
      try {
        await access(filePath);
      } catch {
        throw new LeadFlowError('file_not_found', 404, 'File not found');
      }
      return { filePath, material };
    },

    async health() {
      for (const material of catalog.items) {
        await access(resolve(config.downloadsDir, material.filename));
      }
      return true;
    },
  });
}
