import assert from 'node:assert/strict';
import test from 'node:test';
import { createLeadDatabase } from '../src/database.mjs';
import { LeadFlowError } from '../src/workflow.mjs';
import { createContributionWorkflow } from '../src/contribution-workflow.mjs';

const config = Object.freeze({
  allowedOrigin: 'https://produtocomia.com.br',
  cookieSecret: 's'.repeat(64),
  turnstileSecretKey: 'turnstile-secret',
  turnstileTesting: false,
  contributionPrivacyVersion: '2026-09-21',
  contributionMaxBodyBytes: 96 * 1024,
});

const validContribution = Object.freeze({
  name: 'Pessoa autora',
  email: ' AUTORA@EXAMPLE.COM ',
  role: 'Product Manager',
  siteUrl: 'https://example.com/',
  title: 'Uma contribuição útil',
  excerpt: 'Resumo editorial da contribuição.',
  content: 'Texto completo da contribuição.',
  links: 'https://example.com/referencia',
  bio: 'Bio curta da pessoa autora.',
  language: 'pt-BR',
  privacyVersion: '2026-09-21',
  turnstileToken: 'valid-contribution-turnstile',
  company: '',
  sourcePath: '/contribua/',
  consent: 'on',
});

const allowAllRateLimiter = Object.freeze({
  check: () => ({ allowed: true, retryAfter: 0 }),
});

function setup({
  verifyTurnstileFn = async ({ token, action }) => token === 'valid-contribution-turnstile' && action === 'contribution_submit',
  rateLimiter = allowAllRateLimiter,
} = {}) {
  const now = new Date('2026-09-21T15:00:00.000Z');
  let id = 0;
  const db = createLeadDatabase({
    path: ':memory:',
    clock: () => now,
    randomUUID: () => `submission-${++id}`,
  });
  const workflow = createContributionWorkflow({
    config,
    db,
    verifyTurnstileFn,
    rateLimiter,
    clock: () => now,
  });
  return { db, workflow };
}

test('stores a pending contribution and queues its notification', async () => {
  const { db, workflow } = setup();
  const result = await workflow.submit(validContribution);

  assert.deepEqual(result, { id: 'submission-1', status: 'pending' });
  const stored = db.pendingContributionNotifications(10)[0];
  assert.equal(stored.email, 'autora@example.com');
  assert.equal(stored.status, 'pending');
  assert.equal(stored.sourcePath, '/contribua/');
  db.close();
});

test('rejects missing required contribution fields', async () => {
  const { db, workflow } = setup();
  await assert.rejects(
    () => workflow.submit({ ...validContribution, content: '   ' }),
    (error) => error instanceof LeadFlowError && error.code === 'invalid_submission' && error.status === 400,
  );
  db.close();
});

test('requires explicit accepted consent values', async () => {
  const { db, workflow } = setup();
  for (const consent of [undefined, false, 'false', 'accepted', 1]) {
    await assert.rejects(
      () => workflow.submit({ ...validContribution, consent }),
      (error) => error instanceof LeadFlowError
        && error.code === 'invalid_submission'
        && error.status === 400,
      `consent ${String(consent)} should be rejected`,
    );
  }

  const booleanConsent = await workflow.submit({ ...validContribution, consent: true });
  assert.equal(booleanConsent.status, 'pending');
  db.close();
});

test('normalizes email and rejects invalid email and URL values', async () => {
  const { db, workflow } = setup();
  await assert.rejects(
    () => workflow.submit({ ...validContribution, email: 'not-an-email' }),
    (error) => error.code === 'invalid_email' && error.status === 400,
  );
  await assert.rejects(
    () => workflow.submit({ ...validContribution, siteUrl: 'javascript:alert(1)' }),
    (error) => error.code === 'invalid_url' && error.status === 400,
  );
  await assert.rejects(
    () => workflow.submit({ ...validContribution, links: 'https://ok.example\nftp://bad.example' }),
    (error) => error.code === 'invalid_url' && error.status === 400,
  );
  db.close();
});

test('rejects oversized, stale-privacy, wrong-language, and honeypot submissions', async () => {
  const { db, workflow } = setup();
  await assert.rejects(
    () => workflow.submit({ ...validContribution, content: 'x'.repeat(config.contributionMaxBodyBytes) }),
    (error) => error.code === 'body_too_large' && error.status === 413,
  );
  await assert.rejects(
    () => workflow.submit({ ...validContribution, privacyVersion: '2026-07-22' }),
    (error) => error.code === 'privacy_version_mismatch' && error.status === 400,
  );
  await assert.rejects(
    () => workflow.submit({ ...validContribution, language: 'fr' }),
    (error) => error.code === 'invalid_submission' && error.status === 400,
  );
  await assert.rejects(
    () => workflow.submit({ ...validContribution, company: 'ACME' }),
    (error) => error.code === 'invalid_submission' && error.status === 400,
  );
  db.close();
});

test('requires the contribution Turnstile action and rejects failed verification', async () => {
  let received;
  const { db, workflow } = setup({
    verifyTurnstileFn: async (input) => {
      received = input;
      return false;
    },
  });
  await assert.rejects(
    () => workflow.submit(validContribution),
    (error) => error.code === 'turnstile_failed' && error.status === 400,
  );
  assert.equal(received.action, 'contribution_submit');
  db.close();
});

test('supports English contributions without linking them to leads', async () => {
  const { db, workflow } = setup();
  const result = await workflow.submit({ ...validContribution, language: 'en', sourcePath: '/en/contribute/' });
  const stored = db.pendingContributionNotifications(10)[0];
  assert.equal(result.status, 'pending');
  assert.equal(stored.language, 'en');
  assert.equal(db.findLeadById('submission-1'), undefined);
  db.close();
});

test('rejects contribution submissions with the dedicated rate limit contract', async () => {
  let verificationCalls = 0;
  const { db, workflow } = setup({
    rateLimiter: {
      check: () => ({ allowed: false, retryAfter: 37 }),
    },
    verifyTurnstileFn: async () => {
      verificationCalls += 1;
      return true;
    },
  });

  await assert.rejects(
    () => workflow.submit(validContribution),
    (error) => error instanceof LeadFlowError
      && error.code === 'rate_limited'
      && error.status === 429
      && error.retryAfter === 37,
  );
  assert.equal(verificationCalls, 0);
  assert.deepEqual(db.pendingContributionNotifications(10), []);
  db.close();
});

test('fails closed when a contribution workflow is created without a rate limiter', async () => {
  let verificationCalls = 0;
  const now = new Date('2026-09-21T15:00:00.000Z');
  const db = createLeadDatabase({ path: ':memory:', clock: () => now });
  const workflow = createContributionWorkflow({
    config,
    db,
    verifyTurnstileFn: async () => {
      verificationCalls += 1;
      return true;
    },
    clock: () => now,
  });

  await assert.rejects(
    () => workflow.submit(validContribution),
    (error) => error instanceof LeadFlowError
      && error.code === 'rate_limited'
      && error.status === 429,
  );
  assert.equal(verificationCalls, 0);
  assert.deepEqual(db.pendingContributionNotifications(10), []);
  db.close();
});

test('rejects oversized contribution fields before external verification', async () => {
  const fields = [
    ['name', 'x'.repeat(161)],
    ['role', 'x'.repeat(161)],
    ['siteUrl', `https://${'x'.repeat(2_041)}.example`],
    ['title', 'x'.repeat(241)],
    ['excerpt', 'x'.repeat(2_001)],
    ['content', 'x'.repeat(60_001)],
    ['links', `https://example.com/${'x'.repeat(8_180)}`],
    ['bio', 'x'.repeat(2_001)],
    ['language', 'x'.repeat(6)],
    ['privacyVersion', 'x'.repeat(65)],
    ['turnstileToken', 'x'.repeat(2_049)],
  ];
  let verificationCalls = 0;
  const { db, workflow } = setup({
    verifyTurnstileFn: async () => {
      verificationCalls += 1;
      return true;
    },
  });

  for (const [field, value] of fields) {
    await assert.rejects(
      () => workflow.submit({ ...validContribution, [field]: value }),
      (error) => error.code === 'invalid_submission' && error.status === 400,
      `field ${field} should be capped`,
    );
  }
  assert.equal(verificationCalls, 0);
  db.close();
});
