function required(env, name) {
  const value = env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function positiveInteger(env, name, fallback) {
  const raw = env[name]?.trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return value;
}

function email(env, name) {
  const value = required(env, name).toLowerCase();
  if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error(`${name} must be a valid email address`);
  }
  return value;
}

const TURNSTILE_TEST_SITE_KEYS = new Set([
  '1x00000000000000000000AA',
  '2x00000000000000000000AB',
  '1x00000000000000000000BB',
  '2x00000000000000000000BB',
  '3x00000000000000000000FF',
]);
const TURNSTILE_TEST_SECRET_KEYS = new Set([
  '1x0000000000000000000000000000000AA',
  '2x0000000000000000000000000000000AA',
  '3x0000000000000000000000000000000AA',
]);

export function loadConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV?.trim() || 'production';
  const allowedOrigin = required(env, 'ALLOWED_ORIGIN').replace(/\/$/, '');
  let origin;
  try {
    origin = new URL(allowedOrigin);
  } catch {
    throw new Error('ALLOWED_ORIGIN must be an absolute URL');
  }
  if (origin.origin !== allowedOrigin || (nodeEnv === 'production' && origin.protocol !== 'https:')) {
    throw new Error('ALLOWED_ORIGIN must be a secure origin without a path');
  }

  const cookieSecret = required(env, 'COOKIE_SECRET');
  if (cookieSecret.length < 64) throw new Error('COOKIE_SECRET must contain at least 64 characters');

  const notificationMode = env.NOTIFICATION_MODE?.trim() || 'resend';
  if (!['resend', 'log'].includes(notificationMode)) {
    throw new Error('NOTIFICATION_MODE must be resend or log');
  }

  const privacyVersion = env.PRIVACY_VERSION?.trim() || '2026-07-22';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(privacyVersion)) {
    throw new Error('PRIVACY_VERSION must use YYYY-MM-DD');
  }

  const turnstileSiteKey = required(env, 'TURNSTILE_SITE_KEY');
  const turnstileSecretKey = required(env, 'TURNSTILE_SECRET_KEY');
  if (nodeEnv === 'production' && (
    TURNSTILE_TEST_SITE_KEYS.has(turnstileSiteKey)
    || TURNSTILE_TEST_SECRET_KEYS.has(turnstileSecretKey)
  )) {
    throw new Error('Turnstile test keys are forbidden in production');
  }
  const turnstileTesting = nodeEnv !== 'production'
    && turnstileSiteKey === '1x00000000000000000000AA'
    && turnstileSecretKey === '1x0000000000000000000000000000000AA';

  const config = {
    nodeEnv,
    port: positiveInteger(env, 'PORT', 8787),
    databasePath: required(env, 'DATABASE_PATH'),
    downloadsDir: required(env, 'DOWNLOADS_DIR'),
    downloadCatalogPath: required(env, 'DOWNLOAD_CATALOG_PATH'),
    allowedOrigin,
    cookieSecret,
    turnstileSiteKey,
    turnstileSecretKey,
    turnstileTesting,
    resendApiKey: notificationMode === 'resend' ? required(env, 'RESEND_API_KEY') : env.RESEND_API_KEY?.trim() || '',
    resendFrom: required(env, 'RESEND_FROM'),
    notificationTo: email(env, 'LEAD_NOTIFICATION_TO'),
    notificationMode,
    privacyVersion,
    retentionDays: positiveInteger(env, 'RETENTION_DAYS', 730),
    sessionDays: positiveInteger(env, 'SESSION_DAYS', 180),
    authorizationSeconds: positiveInteger(env, 'AUTHORIZATION_SECONDS', 300),
    maxBodyBytes: positiveInteger(env, 'MAX_BODY_BYTES', 16 * 1024),
  };

  return Object.freeze(config);
}
