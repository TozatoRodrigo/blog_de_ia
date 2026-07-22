import { createHmac, randomBytes, randomUUID } from 'node:crypto';

const SESSION_COOKIE = 'pcm_lead';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export function normalizeEmail(input) {
  if (typeof input !== 'string') throw new Error('A valid email is required');
  const value = input.trim().toLowerCase();
  if (
    value.length === 0
    || value.length > 254
    || /[\r\n]/.test(value)
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ) {
    throw new Error('A valid email is required');
  }
  return value;
}

export function sanitizeSourcePath(input) {
  if (typeof input !== 'string' || input.length > 512) return '/';
  try {
    const base = 'https://produtocomia.invalid';
    const url = new URL(input, base);
    if (url.origin !== base || !url.pathname.startsWith('/')) return '/';
    return url.pathname.replace(/[\u0000-\u001f\u007f]/g, '') || '/';
  } catch {
    return '/';
  }
}

export function sanitizeCampaign(input) {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  return /^[A-Za-z0-9_-]{1,80}$/.test(value) ? value : null;
}

export function createOpaqueToken() {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token, secret) {
  return createHmac('sha256', secret).update(String(token)).digest('hex');
}

export function sessionCookie(token, maxAgeSeconds) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new Error('Invalid session token');
  const maxAge = Math.max(0, Math.floor(Number(maxAgeSeconds)));
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

export function parseSessionCookie(header) {
  if (typeof header !== 'string') return undefined;
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name !== SESSION_COOKIE) continue;
    const value = rest.join('=');
    return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : undefined;
  }
  return undefined;
}

export function verifyOrigin(requestOrigin, allowedOrigin) {
  return typeof requestOrigin === 'string' && requestOrigin === allowedOrigin;
}

export function isHoneypotClear(value) {
  return value === undefined || value === null || value === '';
}

export function createRateLimiter({ secret, maxAttempts = 10, windowMs = 600_000, clock = Date.now }) {
  const attempts = new Map();

  return Object.freeze({
    check(networkKey) {
      const now = Number(clock());
      const key = hashToken(networkKey || 'unknown', secret);
      const cutoff = now - windowMs;
      const recent = (attempts.get(key) ?? []).filter((timestamp) => timestamp > cutoff);

      if (recent.length >= maxAttempts) {
        attempts.set(key, recent);
        return {
          allowed: false,
          retryAfter: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1_000)),
        };
      }

      recent.push(now);
      attempts.set(key, recent);
      if (attempts.size > 10_000) {
        for (const [storedKey, timestamps] of attempts) {
          if (timestamps.every((timestamp) => timestamp <= cutoff)) attempts.delete(storedKey);
        }
      }
      return { allowed: true, retryAfter: 0 };
    },
  });
}

export async function verifyTurnstile({
  token,
  remoteIp,
  secret,
  expectedHostname,
  fetchImpl = fetch,
}) {
  if (typeof token !== 'string' || token.length === 0 || token.length > 2_048) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const response = await fetchImpl(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: remoteIp || undefined,
        idempotency_key: randomUUID(),
      }),
      signal: controller.signal,
    });
    if (!response.ok) return false;
    const result = await response.json();
    return result.success === true
      && result.hostname === expectedHostname
      && result.action === 'download_lead';
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
