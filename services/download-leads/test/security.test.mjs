import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createOpaqueToken,
  createRateLimiter,
  hashToken,
  isHoneypotClear,
  normalizeEmail,
  parseSessionCookie,
  sanitizeCampaign,
  sanitizeSourcePath,
  sessionCookie,
  verifyOrigin,
  verifyTurnstile,
} from '../src/security.mjs';

test('normalizes valid email and rejects unsafe values', () => {
  assert.equal(normalizeEmail(' Pessoa@Example.COM '), 'pessoa@example.com');
  assert.throws(() => normalizeEmail('invalid'), /email/i);
  assert.throws(() => normalizeEmail(`${'a'.repeat(250)}@x.com`), /email/i);
  assert.throws(() => normalizeEmail('a\nb@example.com'), /email/i);
});

test('sanitizes attribution without retaining personal query data', () => {
  assert.equal(
    sanitizeSourcePath('/guias/x/?email=secret@example.com#form'),
    '/guias/x/',
  );
  assert.equal(sanitizeSourcePath('https://attacker.example/steal'), '/');
  assert.equal(sanitizeCampaign('linkedin_newsletter'), 'linkedin_newsletter');
  assert.equal(sanitizeCampaign('<script>'), null);
  assert.equal(sanitizeCampaign(''), null);
});

test('creates opaque signed session cookies', () => {
  const raw = createOpaqueToken();
  assert.match(raw, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(hashToken(raw, 's'.repeat(64)), hashToken(raw, 's'.repeat(64)));
  assert.notEqual(hashToken(raw, 's'.repeat(64)), hashToken(raw, 't'.repeat(64)));
  assert.match(
    sessionCookie(raw, 100),
    /pcm_lead=.+; Path=\/; Max-Age=100; HttpOnly; Secure; SameSite=Lax/,
  );
  assert.equal(parseSessionCookie(`other=x; pcm_lead=${raw}`), raw);
  assert.equal(parseSessionCookie('pcm_lead=invalid token'), undefined);
});

test('accepts only the exact configured request origin', () => {
  assert.equal(verifyOrigin('https://produtocomia.com.br', 'https://produtocomia.com.br'), true);
  assert.equal(verifyOrigin('https://www.produtocomia.com.br', 'https://produtocomia.com.br'), false);
  assert.equal(verifyOrigin(undefined, 'https://produtocomia.com.br'), false);
});

test('honeypot accepts an absent or empty company field only', () => {
  assert.equal(isHoneypotClear(undefined), true);
  assert.equal(isHoneypotClear(''), true);
  assert.equal(isHoneypotClear('ACME'), false);
});

test('rate limiter blocks the eleventh registration and resets after its window', () => {
  let now = 1_000;
  const limiter = createRateLimiter({
    secret: 'r'.repeat(64),
    maxAttempts: 10,
    windowMs: 600_000,
    clock: () => now,
  });

  for (let attempt = 0; attempt < 10; attempt += 1) {
    assert.equal(limiter.check('203.0.113.10').allowed, true);
  }
  const blocked = limiter.check('203.0.113.10');
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfter > 0);
  now += 600_001;
  assert.equal(limiter.check('203.0.113.10').allowed, true);
});

test('verifies a complete Turnstile response server-side', async () => {
  let request;
  const fetchImpl = async (url, options) => {
    request = { url, options, body: JSON.parse(options.body) };
    return new Response(JSON.stringify({
      success: true,
      challenge_ts: '2026-07-22T12:00:00.000Z',
      hostname: 'produtocomia.com.br',
      'error-codes': [],
      action: 'download_lead',
      cdata: '',
      metadata: { ephemeral_id: 'test' },
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  };

  const valid = await verifyTurnstile({
    token: 'turnstile-token',
    remoteIp: '203.0.113.10',
    secret: 'turnstile-secret',
    expectedHostname: 'produtocomia.com.br',
    fetchImpl,
  });

  assert.equal(valid, true);
  assert.equal(request.url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  assert.equal(request.body.secret, 'turnstile-secret');
  assert.equal(request.body.response, 'turnstile-token');
  assert.equal(request.body.remoteip, '203.0.113.10');
  assert.ok(request.body.idempotency_key);
});

test('rejects malformed, failed, mismatched and unavailable Turnstile checks', async () => {
  const response = (body, status = 200) => async () => new Response(JSON.stringify(body), { status });
  const base = {
    token: 'token',
    remoteIp: '203.0.113.10',
    secret: 'secret',
    expectedHostname: 'produtocomia.com.br',
  };

  assert.equal(await verifyTurnstile({ ...base, token: 'x'.repeat(2049), fetchImpl: response({}) }), false);
  assert.equal(await verifyTurnstile({ ...base, fetchImpl: response({ success: false, 'error-codes': ['invalid-input-response'] }) }), false);
  assert.equal(await verifyTurnstile({ ...base, fetchImpl: response({ success: true, hostname: 'evil.example', action: 'download_lead' }) }), false);
  assert.equal(await verifyTurnstile({ ...base, fetchImpl: response({ success: true, hostname: 'produtocomia.com.br', action: 'login' }) }), false);
  assert.equal(await verifyTurnstile({ ...base, fetchImpl: response({}, 503) }), false);
  assert.equal(await verifyTurnstile({ ...base, fetchImpl: async () => { throw new Error('network'); } }), false);
});
