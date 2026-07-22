import assert from 'node:assert/strict';
import test from 'node:test';
import { createLeadDatabase } from '../src/database.mjs';
import { createNotifier, runNotificationBatch } from '../src/notifier.mjs';

const material = Object.freeze({
  id: 'ai-risk-matrix',
  filename: 'ai-risk-matrix.csv',
  contentType: 'text/csv; charset=utf-8',
  labels: Object.freeze({ 'pt-BR': 'Matriz de risco de IA', en: 'AI risk matrix' }),
});

const lead = Object.freeze({
  id: 'lead-1',
  email: 'pessoa@example.com',
  marketingOptIn: 0,
  privacyVersion: '2026-07-22',
});

const event = Object.freeze({
  id: 'event-1',
  leadId: 'lead-1',
  materialId: material.id,
  sourcePath: '/guias/matriz-risco-ia/',
  lang: 'pt-BR',
  campaign: 'linkedin',
  createdAt: '2026-07-22T15:00:00.000Z',
});

test('sends a complete idempotent Resend notification', async () => {
  let request;
  const notifier = createNotifier({
    apiKey: 're_test',
    from: 'Produto com IA <leads@leads.produtocomia.com.br>',
    to: 'rodrigo.tozato@icloud.com',
    mode: 'resend',
    fetchImpl: async (url, options) => {
      request = { url, options, payload: JSON.parse(options.body) };
      return new Response(JSON.stringify({ id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    },
  });

  const result = await notifier.sendDownloadNotification({ event, lead, material });

  assert.equal(result.id, '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
  assert.equal(request.url, 'https://api.resend.com/emails');
  assert.equal(request.options.headers.authorization, 'Bearer re_test');
  assert.equal(request.options.headers['idempotency-key'], `download-event/${event.id}`);
  assert.deepEqual(request.payload.to, ['rodrigo.tozato@icloud.com']);
  assert.match(request.payload.subject, /Novo download: Matriz de risco de IA/);
  assert.match(request.payload.text, /pessoa@example.com/);
  assert.match(request.payload.text, /Autorizou novidades: não/);
  assert.match(request.payload.text, /Campanha: linkedin/);
  assert.doesNotMatch(request.payload.text, /undefined|null/);
});

test('escapes lead-controlled values in the HTML message', async () => {
  let html;
  const notifier = createNotifier({
    apiKey: 're_test',
    from: 'Produto com IA <leads@leads.produtocomia.com.br>',
    to: 'rodrigo.tozato@icloud.com',
    mode: 'resend',
    fetchImpl: async (_url, options) => {
      html = JSON.parse(options.body).html;
      return new Response(JSON.stringify({ id: 'email-id' }), { status: 200 });
    },
  });

  await notifier.sendDownloadNotification({
    event: { ...event, sourcePath: '/<script>alert(1)</script>' },
    lead,
    material,
  });
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});

test('log mode skips the network and does not expose the lead in its result', async () => {
  const notifier = createNotifier({
    apiKey: '',
    from: 'Produto com IA <leads@leads.produtocomia.com.br>',
    to: 'rodrigo.tozato@icloud.com',
    mode: 'log',
    fetchImpl: async () => { throw new Error('network should not be called'); },
  });

  assert.deepEqual(await notifier.sendDownloadNotification({ event, lead, material }), { id: 'logged' });
});

test('redacts Resend failures into bounded operational codes', async () => {
  const notifier = createNotifier({
    apiKey: 're_secret_that_must_not_leak',
    from: 'Produto com IA <leads@leads.produtocomia.com.br>',
    to: 'rodrigo.tozato@icloud.com',
    mode: 'resend',
    fetchImpl: async () => new Response(JSON.stringify({ message: 'pessoa@example.com denied re_secret_that_must_not_leak' }), { status: 503 }),
  });

  await assert.rejects(
    () => notifier.sendDownloadNotification({ event, lead, material }),
    (error) => error.code === 'resend_http_503'
      && !error.message.includes(lead.email)
      && !error.message.includes('re_secret'),
  );
});

test('notification worker marks real database events as sent', async () => {
  const db = createLeadDatabase({
    path: ':memory:',
    clock: () => new Date('2026-07-22T15:00:00.000Z'),
    randomUUID: (() => { let id = 0; return () => `worker-${++id}`; })(),
  });
  const storedLead = db.upsertLead({ email: lead.email, marketingOptIn: false, privacyVersion: '2026-07-22' });
  db.createDownloadEvent({
    leadId: storedLead.id,
    materialId: material.id,
    sourcePath: event.sourcePath,
    lang: event.lang,
    campaign: event.campaign,
  });
  const catalog = { byId: new Map([[material.id, material]]) };
  const notifier = createNotifier({
    apiKey: 're_test',
    from: 'Produto com IA <leads@leads.produtocomia.com.br>',
    to: 'rodrigo.tozato@icloud.com',
    mode: 'resend',
    fetchImpl: async () => new Response(JSON.stringify({ id: 'sent-id' }), { status: 200 }),
  });

  assert.deepEqual(await runNotificationBatch({ db, notifier, catalog, limit: 20 }), { sent: 1, failed: 0 });
  assert.deepEqual(db.pendingNotifications(20), []);
  db.close();
});

test('notification worker preserves failed events for retry', async () => {
  const db = createLeadDatabase({ path: ':memory:' });
  const storedLead = db.upsertLead({ email: lead.email, marketingOptIn: false, privacyVersion: '2026-07-22' });
  const storedEvent = db.createDownloadEvent({
    leadId: storedLead.id,
    materialId: material.id,
    sourcePath: event.sourcePath,
    lang: event.lang,
    campaign: event.campaign,
  });
  const notifier = createNotifier({
    apiKey: 're_test',
    from: 'Produto com IA <leads@leads.produtocomia.com.br>',
    to: 'rodrigo.tozato@icloud.com',
    mode: 'resend',
    fetchImpl: async () => new Response('', { status: 429 }),
  });

  assert.deepEqual(await runNotificationBatch({
    db,
    notifier,
    catalog: { byId: new Map([[material.id, material]]) },
    limit: 20,
  }), { sent: 0, failed: 1 });
  assert.equal(db.pendingNotifications(20)[0].id, storedEvent.id);
  assert.equal(db.pendingNotifications(20)[0].notificationAttempts, 1);
  db.close();
});
