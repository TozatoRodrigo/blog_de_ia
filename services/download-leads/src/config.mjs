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

  const config = {
    nodeEnv,
    port: positiveInteger(env, 'PORT', 8787),
    databasePath: required(env, 'DATABASE_PATH'),
    downloadsDir: required(env, 'DOWNLOADS_DIR'),
    downloadCatalogPath: required(env, 'DOWNLOAD_CATALOG_PATH'),
    allowedOrigin,
    cookieSecret,
    turnstileSiteKey: required(env, 'TURNSTILE_SITE_KEY'),
    turnstileSecretKey: required(env, 'TURNSTILE_SECRET_KEY'),
    resendApiKey: notificationMode === 'resend' ? required(env, 'RESEND_API_KEY') : env.RESEND_API_KEY?.trim() || '',
    resendFrom: required(env, 'RESEND_FROM'),
    notificationTo: email(env, 'LEAD_NOTIFICATION_TO'),
    notificationMode,
    retentionDays: positiveInteger(env, 'RETENTION_DAYS', 730),
    sessionDays: positiveInteger(env, 'SESSION_DAYS', 180),
    authorizationSeconds: positiveInteger(env, 'AUTHORIZATION_SECONDS', 300),
    maxBodyBytes: positiveInteger(env, 'MAX_BODY_BYTES', 16 * 1024),
  };

  return Object.freeze(config);
}
