import {
  isHoneypotClear,
  normalizeEmail,
  sanitizeSourcePath,
  verifyTurnstile,
} from './security.mjs';
import { LeadFlowError } from './workflow.mjs';

const FIELD_LIMITS = Object.freeze({
  name: 160,
  email: 254,
  role: 160,
  siteUrl: 2_048,
  title: 240,
  excerpt: 2_000,
  content: 60_000,
  links: 8_192,
  bio: 2_000,
  language: 5,
  sourcePath: 512,
  privacyVersion: 64,
  turnstileToken: 2_048,
  company: 160,
});

function invalidSubmission(message = 'Invalid submission', field) {
  const error = new LeadFlowError('invalid_submission', 400, message);
  if (field) error.field = field;
  return error;
}

function consentAccepted(value) {
  if (value === true) return true;
  if (typeof value !== 'string') return false;
  return ['on', 'true', '1', 'yes'].includes(value.trim().toLowerCase());
}

function stringValue(value, field, { required = false } = {}) {
  if (typeof value !== 'string') {
    if (required) throw invalidSubmission('Required fields are missing', field);
    return '';
  }
  const normalized = value.trim();
  if (required && normalized.length === 0) throw invalidSubmission('Required fields are missing', field);
  if (normalized.length > FIELD_LIMITS[field]) throw invalidSubmission('One or more fields are too long', field);
  return normalized;
}

function httpUrl(value, field = 'siteUrl') {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('unsupported protocol');
    return url.toString();
  } catch {
    const error = new LeadFlowError('invalid_url', 400, 'Enter valid http or https links');
    error.field = field;
    throw error;
  }
}

function optionalUrl(value) {
  if (!value) return '';
  return httpUrl(value, 'siteUrl');
}

function normalizeLinks(value) {
  if (!value) return '';
  const links = value.split(/\r?\n/).map((link) => link.trim()).filter(Boolean).map((link) => httpUrl(link, 'links'));
  return links.join('\n');
}

function bodySize(input) {
  try {
    return Buffer.byteLength(JSON.stringify(input), 'utf8');
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

const failClosedRateLimiter = Object.freeze({
  check() {
    return { allowed: false, retryAfter: 60 };
  },
});

function rateLimited(retryAfter) {
  const error = new LeadFlowError('rate_limited', 429, 'Try again later');
  error.retryAfter = Math.max(1, Math.ceil(Number(retryAfter) || 1));
  return error;
}

export function createContributionWorkflow({
  config,
  db,
  verifyTurnstileFn = verifyTurnstile,
  rateLimiter = failClosedRateLimiter,
  clock = () => new Date(),
}) {
  const expectedHostname = new URL(config.allowedOrigin).hostname;

  return Object.freeze({
    async submit(input = {}) {
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw invalidSubmission();
      if (bodySize(input) > config.contributionMaxBodyBytes) {
        throw new LeadFlowError('body_too_large', 413, 'Request is too large');
      }

      if (!isHoneypotClear(input.company)) throw invalidSubmission();
      if (!consentAccepted(input.consent)) throw invalidSubmission('Invalid submission', 'consent');

      const limit = rateLimiter.check(input.remoteIp);
      if (!limit.allowed) throw rateLimited(limit.retryAfter);

      const name = stringValue(input.name, 'name', { required: true });
      const role = stringValue(input.role, 'role');
      const siteUrl = stringValue(input.siteUrl, 'siteUrl');
      const title = stringValue(input.title, 'title', { required: true });
      const excerpt = stringValue(input.excerpt, 'excerpt', { required: true });
      const content = stringValue(input.content, 'content', { required: true });
      const links = stringValue(input.links, 'links');
      const bio = stringValue(input.bio, 'bio', { required: true });
      const language = stringValue(input.language, 'language', { required: true });
      const sourcePath = sanitizeSourcePath(stringValue(input.sourcePath, 'sourcePath'));
      const privacyVersion = stringValue(input.privacyVersion, 'privacyVersion', { required: true });
      const turnstileToken = stringValue(input.turnstileToken, 'turnstileToken');

      if (!['pt-BR', 'en'].includes(language)) throw invalidSubmission('Unsupported language');
      if (privacyVersion !== config.contributionPrivacyVersion) {
        throw new LeadFlowError('privacy_version_mismatch', 400, 'Please reload and try again');
      }

      let email;
      try {
        email = normalizeEmail(input.email);
      } catch {
        const error = new LeadFlowError('invalid_email', 400, 'Enter a valid email');
        error.field = 'email';
        throw error;
      }

      const normalizedSiteUrl = optionalUrl(siteUrl);
      const normalizedLinks = normalizeLinks(links);
      const turnstileValid = await verifyTurnstileFn({
        token: turnstileToken,
        remoteIp: input.remoteIp,
        secret: config.turnstileSecretKey,
        expectedHostname,
        testing: config.turnstileTesting,
        action: 'contribution_submit',
      });
      if (!turnstileValid) {
        throw new LeadFlowError('turnstile_failed', 400, 'Verification failed; try again');
      }

      const submission = db.createEditorialSubmission({
        name,
        email,
        role,
        siteUrl: normalizedSiteUrl,
        title,
        excerpt,
        content,
        links: normalizedLinks,
        bio,
        language,
        sourcePath,
        privacyVersion,
        status: 'pending',
        createdAt: clock().toISOString(),
      });
      return { id: submission.id, status: submission.status };
    },
  });
}
