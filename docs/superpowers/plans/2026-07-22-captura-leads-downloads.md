# Download Lead Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capturar um e-mail no primeiro download, reconhecer o mesmo visitante nos downloads seguintes, registrar cada evento e notificar `rodrigo.tozato@icloud.com` sem reduzir a indexação das páginas públicas.

**Architecture:** O Astro continua estático e recebe um componente global que intercepta links `/downloads/`. Um serviço Node.js isolado valida Cloudflare Turnstile, persiste leads e eventos em SQLite, cria sessões para downloads posteriores e autorizações curtas, envia notificações pelo Resend e entrega os arquivos privados. O nginx encaminha API e fallback sem JavaScript; o deploy retira `dist/downloads` da raiz pública e o monta somente no serviço.

**Tech Stack:** Astro 5, TypeScript, JavaScript ESM, Node.js 24 LTS (`node:http`, `node:sqlite`, `node:test`), SQLite, nginx, Docker Compose, Cloudflare Turnstile, Resend API e Umami.

---

## File map

### Shared catalog

- `config/downloads.json`: allowlist central dos 12 arquivos, rótulos bilíngues, tipos MIME e nomes seguros.
- `tests/download-catalog.test.mjs`: garante unicidade, cobertura dos links editoriais e existência física.

### Lead service

- `services/download-leads/package.json`: scripts isolados do serviço.
- `services/download-leads/Dockerfile`: imagem Node 24 não-root e healthcheck.
- `services/download-leads/src/config.mjs`: validação estrita das variáveis de ambiente.
- `services/download-leads/src/catalog.mjs`: carregamento da allowlist e resolução segura de arquivos.
- `services/download-leads/src/database.mjs`: schema SQLite, consultas parametrizadas e backup.
- `services/download-leads/src/security.mjs`: normalização de e-mail, cookies, hashes, tokens, origem, honeypot, rate limit e Turnstile.
- `services/download-leads/src/notifier.mjs`: e-mail Resend com idempotência e retentativas.
- `services/download-leads/src/workflow.mjs`: casos de uso de primeiro lead, retorno, autorização e download.
- `services/download-leads/src/http.mjs`: rotas JSON, fallback HTML e streaming do arquivo.
- `services/download-leads/src/server.mjs`: composição, worker e encerramento gracioso.
- `services/download-leads/test/*.test.mjs`: testes unitários e HTTP com dependências injetadas.

### Site

- `src/components/DownloadLeadGate.astro`: modal bilíngue, foco, Turnstile, fallback e eventos Umami.
- `src/components/GuideResources.astro`: marca os links com identificador e rótulo, mantendo `href` progressivo.
- `src/layouts/BaseLayout.astro`: monta o gate uma única vez em todas as páginas.
- `src/styles/global.css`: estilos responsivos e acessíveis.
- `src/pages/privacidade.astro`: política PT.
- `src/pages/en/privacy.astro`: política EN.
- `src/components/Footer.astro`: links das políticas.
- `tests/download-gate.test.mjs`: verifica HTML, acessibilidade, privacidade e ausência de PII no tracking.

### Operations

- `deploy/docker-compose.yml`: adiciona `download-leads`, volume de banco e volume privado de arquivos.
- `deploy/nginx.conf`: proxy da API e dos links diretos, CSP do Turnstile e limites de corpo.
- `deploy/download-leads.env.example`: contrato de configuração sem segredos.
- `scripts/deploy.sh`: publica site, serviço, catálogo e arquivos privados com backup e rollback.
- `scripts/smoke-test.mjs`: verifica saúde, fallback, arquivos protegidos e páginas públicas.
- `scripts/audit-dist.mjs`: confirma que os materiais existem no build antes da separação do deploy.
- `docs/operations/download-leads-runbook.md`: ativação Resend/Turnstile, teste, exportação, exclusão e restauração.

## Task 1: Establish the central download allowlist

**Files:**
- Create: `config/downloads.json`
- Create: `tests/download-catalog.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing catalog test**

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { glob } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('../config/downloads.json', import.meta.url), 'utf8'));

test('download catalog has unique ids and files', async () => {
  assert.equal(catalog.length, 12);
  assert.equal(new Set(catalog.map((item) => item.id)).size, catalog.length);
  assert.equal(new Set(catalog.map((item) => item.filename)).size, catalog.length);
  for (const item of catalog) {
    assert.match(item.id, /^[a-z0-9-]+$/);
    assert.equal(item.filename.includes('/'), false);
    assert.ok(item.labels['pt-BR']);
    assert.ok(item.labels.en);
    assert.match(item.contentType, /^(application|text)\//);
    const bytes = await readFile(new URL(`../public/downloads/${item.filename}`, import.meta.url));
    assert.ok(bytes.length > 80);
  }
});

test('every editorial download link is allowlisted', async () => {
  const filenames = new Set(catalog.map((item) => item.filename));
  for await (const relative of glob('src/content/{guides,guides-en}/*.md', { cwd: root })) {
    const markdown = await readFile(new URL(`../${relative}`, import.meta.url), 'utf8');
    for (const match of markdown.matchAll(/href: "\/downloads\/([^"?]+)"/g)) {
      assert.ok(filenames.has(match[1]), `${relative}: ${match[1]} is missing from catalog`);
    }
  }
});
```

- [ ] **Step 2: Run the test and verify the missing catalog failure**

Run: `node --test tests/download-catalog.test.mjs`

Expected: FAIL with `ENOENT ... config/downloads.json`.

- [ ] **Step 3: Create the complete allowlist**

Create `config/downloads.json` with exactly these objects:

```json
[
  {"id":"checklist-governanca-ia","filename":"checklist-governanca-de-ia.md","contentType":"text/markdown; charset=utf-8","labels":{"pt-BR":"Checklist de governança de IA","en":"AI governance checklist (Portuguese)"}},
  {"id":"ai-governance-checklist","filename":"ai-governance-checklist.md","contentType":"text/markdown; charset=utf-8","labels":{"pt-BR":"Checklist de governança de IA (inglês)","en":"AI governance checklist"}},
  {"id":"matriz-risco-ia","filename":"matriz-risco-ia.csv","contentType":"text/csv; charset=utf-8","labels":{"pt-BR":"Matriz de risco de IA","en":"AI risk matrix (Portuguese)"}},
  {"id":"ai-risk-matrix","filename":"ai-risk-matrix.csv","contentType":"text/csv; charset=utf-8","labels":{"pt-BR":"Matriz de risco de IA (inglês)","en":"AI risk matrix"}},
  {"id":"inventario-sistemas-ia","filename":"inventario-sistemas-de-ia.csv","contentType":"text/csv; charset=utf-8","labels":{"pt-BR":"Inventário de sistemas de IA","en":"AI system inventory (Portuguese)"}},
  {"id":"ai-system-inventory","filename":"ai-system-inventory.csv","contentType":"text/csv; charset=utf-8","labels":{"pt-BR":"Inventário de sistemas de IA (inglês)","en":"AI system inventory"}},
  {"id":"template-avaliacao-agente-ia","filename":"template-avaliacao-agente-de-ia.csv","contentType":"text/csv; charset=utf-8","labels":{"pt-BR":"Template de avaliação de agente de IA","en":"AI agent evaluation template (Portuguese)"}},
  {"id":"ai-agent-evaluation-template","filename":"ai-agent-evaluation-template.csv","contentType":"text/csv; charset=utf-8","labels":{"pt-BR":"Template de avaliação de agente de IA (inglês)","en":"AI agent evaluation template"}},
  {"id":"questionario-ia-produto","filename":"questionario-ia-gestao-de-produto.md","contentType":"text/markdown; charset=utf-8","labels":{"pt-BR":"Questionário de IA em gestão de produto","en":"AI product management survey (Portuguese)"}},
  {"id":"ai-product-management-survey","filename":"ai-product-management-survey.md","contentType":"text/markdown; charset=utf-8","labels":{"pt-BR":"Questionário de IA em gestão de produto (inglês)","en":"AI product management survey"}},
  {"id":"estado-ia-produto-2026","filename":"estado-ia-gestao-de-produto-2026.pdf","contentType":"application/pdf","labels":{"pt-BR":"Estado da IA em gestão de produto 2026","en":"State of AI in product management 2026 (Portuguese)"}},
  {"id":"state-ai-product-2026","filename":"state-of-ai-in-product-management-2026.pdf","contentType":"application/pdf","labels":{"pt-BR":"Estado da IA em gestão de produto 2026 (inglês)","en":"State of AI in product management 2026"}}
]
```

- [ ] **Step 4: Add the catalog test to the main test command**

Keep `test` as `tests/*.test.mjs`; the new file is discovered automatically. Add only the future service hook now:

```json
"test:leads": "npm --prefix services/download-leads test"
```

Do not add `test:leads` to `validate` until Task 6 creates the service.

- [ ] **Step 5: Run and commit**

Run: `node --test tests/download-catalog.test.mjs && npm test`

Expected: catalog tests and the existing 28 tests PASS after `npm run build` has produced `dist`.

```bash
git add config/downloads.json tests/download-catalog.test.mjs package.json
git commit -m "test: define protected download catalog"
```

## Task 2: Scaffold and validate the lead service

**Files:**
- Create: `services/download-leads/package.json`
- Create: `services/download-leads/src/config.mjs`
- Create: `services/download-leads/src/catalog.mjs`
- Create: `services/download-leads/test/config.test.mjs`

- [ ] **Step 1: Write failing configuration and catalog tests**

Test these exact behaviors:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadConfig } from '../src/config.mjs';
import { loadCatalog } from '../src/catalog.mjs';

const valid = {
  NODE_ENV: 'test', PORT: '8787', DATABASE_PATH: ':memory:', DOWNLOADS_DIR: '/tmp/files',
  DOWNLOAD_CATALOG_PATH: new URL('../../../config/downloads.json', import.meta.url).pathname,
  ALLOWED_ORIGIN: 'https://produtocomia.com.br', COOKIE_SECRET: 'x'.repeat(64),
  TURNSTILE_SITE_KEY: '1x00000000000000000000AA', TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
  RESEND_API_KEY: 're_test', RESEND_FROM: 'Produto com IA <leads@leads.produtocomia.com.br>',
  LEAD_NOTIFICATION_TO: 'rodrigo.tozato@icloud.com'
};

test('loadConfig rejects missing and weak secrets', () => {
  assert.throws(() => loadConfig({ ...valid, COOKIE_SECRET: 'short' }), /COOKIE_SECRET/);
  assert.throws(() => loadConfig({ ...valid, LEAD_NOTIFICATION_TO: '' }), /LEAD_NOTIFICATION_TO/);
});

test('loadConfig returns normalized immutable values', () => {
  const config = loadConfig(valid);
  assert.equal(config.port, 8787);
  assert.equal(config.allowedOrigin, 'https://produtocomia.com.br');
  assert.equal(Object.isFrozen(config), true);
});

test('loadCatalog resolves only declared ids and filenames', async () => {
  const catalog = await loadCatalog(valid.DOWNLOAD_CATALOG_PATH);
  assert.equal(catalog.byId.get('ai-risk-matrix').filename, 'ai-risk-matrix.csv');
  assert.equal(catalog.byFilename.get('../.env'), undefined);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test services/download-leads/test/config.test.mjs`

Expected: FAIL because `config.mjs` and `catalog.mjs` do not exist.

- [ ] **Step 3: Implement strict config parsing**

`loadConfig(env)` must validate every variable named in the test, require HTTPS for production origin, accept `NOTIFICATION_MODE` only as `resend` or `log`, default retention to 730 days, session to 180 days, authorization to 300 seconds, request body to 16 KiB, and return `Object.freeze({...})`. Never provide production defaults for secrets.

Export this interface through property names used by later tasks:

```js
{
  nodeEnv, port, databasePath, downloadsDir, downloadCatalogPath,
  allowedOrigin, cookieSecret, turnstileSiteKey, turnstileSecretKey,
  resendApiKey, resendFrom, notificationTo, notificationMode,
  retentionDays, sessionDays, authorizationSeconds, maxBodyBytes
}
```

- [ ] **Step 4: Implement the catalog loader**

`loadCatalog(path)` reads JSON, rejects duplicate ids/files, rejects filenames containing `/`, `\\` or `..`, freezes each item and returns `{ items, byId, byFilename }`. Do not infer disk paths from request strings.

- [ ] **Step 5: Create the isolated package**

```json
{
  "name": "@produtocomia/download-leads",
  "private": true,
  "type": "module",
  "engines": {"node": ">=24.14"},
  "scripts": {
    "start": "node src/server.mjs",
    "test": "node --disable-warning=ExperimentalWarning --test test/*.test.mjs"
  }
}
```

- [ ] **Step 6: Run and commit**

Run: `npm --prefix services/download-leads test`

Expected: 3 tests PASS.

```bash
git add services/download-leads
git commit -m "feat: scaffold download lead service"
```

## Task 3: Persist leads, sessions, downloads and notification state

**Files:**
- Create: `services/download-leads/src/database.mjs`
- Create: `services/download-leads/test/database.test.mjs`

- [ ] **Step 1: Write failing database tests**

Use a fresh `DatabaseSync(':memory:')` per test. Assert:

```js
const lead = db.upsertLead({ email: 'pessoa@example.com', marketingOptIn: false, privacyVersion: '2026-07-22' });
const updated = db.upsertLead({ email: 'pessoa@example.com', marketingOptIn: true, privacyVersion: '2026-07-22' });
assert.equal(updated.id, lead.id);
assert.equal(updated.marketingOptIn, 1);

db.createSession({ leadId: lead.id, tokenHash: 'hash', expiresAt: '2030-01-01T00:00:00.000Z' });
assert.equal(db.findLeadBySessionHash('hash').email, 'pessoa@example.com');

const event = db.createDownloadEvent({ leadId: lead.id, materialId: 'ai-risk-matrix', sourcePath: '/en/guides/ai-risk-matrix/', lang: 'en', campaign: 'linkedin' });
const token = db.createDownloadAuthorization({ eventId: event.id, tokenHash: 'download-hash', expiresAt: '2030-01-01T00:00:00.000Z', maxUses: 3 });
assert.equal(db.consumeDownloadAuthorization('download-hash').eventId, event.id);
assert.equal(db.consumeDownloadAuthorization('download-hash').uses, 2);
assert.equal(db.pendingNotifications(10)[0].id, event.id);
```

Also assert expired sessions/tokens return `undefined`, fourth token use fails, `markNotificationSent` removes the event from the queue, and `markNotificationFailed` increments attempts while preserving the event.

- [ ] **Step 2: Run and verify missing module failure**

Run: `npm --prefix services/download-leads test`

Expected: FAIL resolving `database.mjs`.

- [ ] **Step 3: Implement schema and prepared statements**

Use `DatabaseSync` with `timeout: 5000`, `PRAGMA journal_mode=WAL`, `PRAGMA foreign_keys=ON`, `PRAGMA busy_timeout=5000`, and these tables:

```sql
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, marketing_opt_in INTEGER NOT NULL DEFAULT 0,
  privacy_version TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS download_events (
  id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  material_id TEXT NOT NULL, source_path TEXT NOT NULL, lang TEXT NOT NULL, campaign TEXT,
  created_at TEXT NOT NULL, notification_state TEXT NOT NULL DEFAULT 'pending',
  notification_attempts INTEGER NOT NULL DEFAULT 0, notification_last_error TEXT,
  notification_sent_at TEXT
);
CREATE TABLE IF NOT EXISTS download_authorizations (
  token_hash TEXT PRIMARY KEY, event_id TEXT NOT NULL REFERENCES download_events(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL, uses INTEGER NOT NULL DEFAULT 0, max_uses INTEGER NOT NULL DEFAULT 3,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_events_notification ON download_events(notification_state, created_at);
CREATE INDEX IF NOT EXISTS idx_authorizations_expiry ON download_authorizations(expires_at);
```

All writes use transactions and bound parameters. `pendingNotifications(limit)` returns download events with camelCase properties; `findLeadById(id)` returns the associated lead for the notification worker. Export `createLeadDatabase({ path, clock, randomUUID })` returning only the methods exercised by tests plus `findLeadById`, `deleteLeadByEmail`, `purgeExpired`, `purgeOlderThan`, `backupTo` and `close`.

- [ ] **Step 4: Run and commit**

Run: `npm --prefix services/download-leads test`

Expected: all service tests PASS.

```bash
git add services/download-leads/src/database.mjs services/download-leads/test/database.test.mjs
git commit -m "feat: persist leads and download events"
```

## Task 4: Protect the flow with validation, sessions and Turnstile

**Files:**
- Create: `services/download-leads/src/security.mjs`
- Create: `services/download-leads/test/security.test.mjs`

- [ ] **Step 1: Write failing security tests**

Cover exact contracts:

```js
assert.equal(normalizeEmail(' Pessoa@Example.COM '), 'pessoa@example.com');
assert.throws(() => normalizeEmail('invalid'), /email/i);
assert.throws(() => normalizeEmail(`${'a'.repeat(250)}@x.com`), /email/i);
assert.equal(sanitizeSourcePath('/guias/x/?email=secret@example.com'), '/guias/x/');
assert.equal(sanitizeCampaign('linkedin_newsletter'), 'linkedin_newsletter');
assert.equal(sanitizeCampaign('<script>'), null);

const raw = createOpaqueToken();
assert.match(raw, /^[A-Za-z0-9_-]{43}$/);
assert.equal(hashToken(raw, 's'.repeat(64)), hashToken(raw, 's'.repeat(64)));
assert.match(sessionCookie(raw, 100), /HttpOnly; Secure; SameSite=Lax; Path=\/; Max-Age=100/);
assert.equal(parseSessionCookie(`other=x; pcm_lead=${raw}`), raw);
```

For `verifyTurnstile`, inject fake `fetch`; assert request goes to `https://challenges.cloudflare.com/turnstile/v0/siteverify`, checks `success`, `hostname === produtocomia.com.br`, `action === download_lead`, rejects tokens over 2048 characters and times out. For the limiter, assert the 11th registration from one network key in 10 minutes receives a retry time.

- [ ] **Step 2: Implement security helpers**

Use `crypto.randomBytes(32).toString('base64url')`, keyed `createHmac('sha256', secret)`, constant-time comparison where applicable, strict origin comparison, a hidden field named `company`, and an in-memory sliding-window limiter that stores only HMAC-derived network keys. Never write raw IPs to SQLite or application logs.

`verifyTurnstile({ token, remoteIp, secret, expectedHostname, fetchImpl })` must call Siteverify server-side, set a 5-second abort timeout, and return `true` only for the configured hostname/action. Use Cloudflare's published test keys only in tests.

- [ ] **Step 3: Run and commit**

Run: `npm --prefix services/download-leads test`

Expected: security and prior service tests PASS.

```bash
git add services/download-leads/src/security.mjs services/download-leads/test/security.test.mjs
git commit -m "feat: secure lead registration flow"
```

## Task 5: Send durable, idempotent lead notifications

**Files:**
- Create: `services/download-leads/src/notifier.mjs`
- Create: `services/download-leads/test/notifier.test.mjs`

- [ ] **Step 1: Write failing notifier tests**

Inject `fetch` and assert one POST to `https://api.resend.com/emails` with:

```js
assert.equal(request.headers.Authorization, 'Bearer re_test');
assert.equal(request.headers['Idempotency-Key'], `download-event/${event.id}`);
assert.deepEqual(payload.to, ['rodrigo.tozato@icloud.com']);
assert.match(payload.subject, /Novo download: Matriz de risco de IA/);
assert.match(payload.text, /pessoa@example.com/);
assert.match(payload.text, /Autorizou novidades: não/);
assert.doesNotMatch(payload.text, /undefined|null/);
```

Assert non-2xx responses throw an error without the API key or full response body. Assert `notificationMode: 'log'` skips network and returns `{ id: 'logged' }` without logging the email.

- [ ] **Step 2: Implement `createNotifier`**

Expose `sendDownloadNotification({ event, lead, material })`. Escape HTML, include a plain-text version, use São Paulo date formatting, the configured sender/recipient and `Idempotency-Key: download-event/<event id>`. Redact secrets and email values from thrown messages.

Expose `runNotificationBatch({ db, notifier, catalog, limit: 20 })`: select pending/failed items with fewer than 8 attempts, call notifier, mark sent; on failure store only a bounded error code. The server will call it at startup and every 60 seconds.

- [ ] **Step 3: Run and commit**

Run: `npm --prefix services/download-leads test`

Expected: notifier and prior tests PASS.

```bash
git add services/download-leads/src/notifier.mjs services/download-leads/test/notifier.test.mjs
git commit -m "feat: notify owner about protected downloads"
```

## Task 6: Implement registration, returning sessions and protected file delivery

**Files:**
- Create: `services/download-leads/src/workflow.mjs`
- Create: `services/download-leads/src/http.mjs`
- Create: `services/download-leads/src/server.mjs`
- Create: `services/download-leads/test/http.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write HTTP integration tests**

Start the handler on an ephemeral port with in-memory DB, temporary files, fake Turnstile and fake notifier. Test:

1. `GET /api/download-leads/config` returns only `turnstileSiteKey` and `privacyVersion`.
2. `POST /api/download-leads/register` rejects wrong origin, invalid JSON, body over 16 KiB, honeypot, bad email, unknown material and failed Turnstile.
3. Valid registration returns 201, `Set-Cookie` with secure flags and a URL under `/api/download-leads/file/`; DB has one lead/event.
4. `POST /api/download-leads/authorize` without cookie returns 401; with cookie returns a second token without collecting email again.
5. File endpoint streams declared bytes with catalog MIME, `Content-Disposition: attachment`, `Cache-Control: private, no-store`, `X-Content-Type-Options: nosniff`; unknown/expired/exhausted tokens return 404.
6. `GET /downloads/ai-risk-matrix.csv` renders the simple English/PT form according to `?lang=` and contains the privacy link plus Turnstile.
7. `POST /api/download-leads/register-form` returns 303 to the protected file on success and an accessible HTML error on failure.
8. `GET /api/download-leads/health` returns 200 only when DB and downloads directory are readable.

- [ ] **Step 2: Implement pure workflows**

`createLeadWorkflow(deps)` exposes:

```js
register({ email, marketingOptIn, privacyVersion, materialId, sourcePath, lang, campaign, turnstileToken, remoteIp })
authorize({ sessionToken, materialId, sourcePath, lang, campaign })
resolveFile({ downloadToken })
```

`register` verifies Turnstile before DB writes, upserts lead, rotates/creates a session, creates one event and an authorization with three uses/five-minute expiry. `authorize` hashes and resolves the cookie, otherwise returns a typed `unauthorized` error. `resolveFile` consumes authorization and combines only `config.downloadsDir` with the allowlisted catalog filename; verify the resolved path still starts with the configured directory.

- [ ] **Step 3: Implement the HTTP adapter**

Use only `node:http`, cap input while streaming, accept `application/json` and `application/x-www-form-urlencoded`, emit a random `X-Request-Id`, never echo email, and map typed errors to 400/401/404/429/503. All API responses receive `Cache-Control: no-store`.

The fallback HTML must contain a real `<label>`, `type="email"`, optional unchecked marketing checkbox, honeypot outside the tab order, privacy link, Turnstile widget, localized error summary and no third-party script besides `challenges.cloudflare.com`.

- [ ] **Step 4: Compose the server and worker**

`server.mjs` loads config/catalog, opens DB, creates notifier/workflow/handler, starts on `0.0.0.0`, runs notification batch at startup/every 60 seconds, purges expired tokens daily, and handles `SIGTERM` by clearing timers, closing HTTP and SQLite.

- [ ] **Step 5: Activate service tests in the root validation**

Change root scripts to:

```json
"test": "node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/*.test.mjs",
"test:leads": "npm --prefix services/download-leads test",
"validate": "npm run check && npm run generate:og && npm run build && npm test && npm run test:leads && npm run audit:dist"
```

- [ ] **Step 6: Run and commit**

Run: `npm run test:leads && npm run validate`

Expected: all service/root checks PASS.

```bash
git add services/download-leads package.json
git commit -m "feat: deliver downloads through lead API"
```

## Task 7: Build the accessible, bilingual download gate

**Files:**
- Create: `src/components/DownloadLeadGate.astro`
- Create: `tests/download-gate.test.mjs`
- Modify: `src/components/GuideResources.astro`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write failing generated-page tests**

After build, parse a PT and EN guide with Cheerio. Assert:

```js
assert.equal(pt('[data-download-gate]').length, 1);
assert.equal(pt('dialog#download-lead-dialog').attr('aria-labelledby'), 'download-lead-title');
assert.equal(pt('#download-lead-email').attr('type'), 'email');
assert.equal(pt('#download-marketing-opt-in').attr('checked'), undefined);
assert.equal(pt('a[href^="/downloads/"][data-download-id]').length > 0, true);
assert.match(pt('[data-download-copy]').attr('data-download-copy'), /Receba o material/);
assert.match(en('[data-download-copy]').attr('data-download-copy'), /Get the free resource/);
```

Read the component source and assert analytics event names exist while `umami.track` calls do not include `email`, `name` or `turnstileToken` properties.

- [ ] **Step 2: Add material metadata to links**

In `GuideResources.astro`, derive `downloadId` from the href basename through the catalog imported from `../../config/downloads.json`. Render:

```astro
<a
  class="topic-card"
  href={resource.href}
  data-download-id={downloadItem?.id}
  data-download-label={resource.label}
  data-download-format={resource.format}
>
```

Remove the native `download` attribute so nginx/API fallback can control delivery.

- [ ] **Step 3: Implement the dialog and progressive enhancement**

The component renders one native `<dialog>` with email, optional unchecked marketing box, hidden `materialId`, honeypot, privacy link, error/status live regions and close button. Client code must:

1. delegate clicks for every same-origin `a[href^="/downloads/"]` with a catalog id;
2. call `/api/download-leads/authorize` first;
3. start the returned URL immediately for a recognized session;
4. on 401, open the dialog, set labels and lazily load Turnstile explicitly;
5. submit to `/api/download-leads/register`;
6. on success close the dialog and navigate to the protected file URL;
7. return focus on close, trap Tab within the dialog and honor Escape;
8. leave the original link untouched if JavaScript fails;
9. emit only `material_id`, `lang`, `source_path` and `returning_visitor` in analytics.

Track exactly: `download_gate_opened`, `download_lead_submitted`, `download_authorized_returning_lead`, `download_started`, `download_failed`, `download_marketing_opt_in`.

- [ ] **Step 4: Mount once in the base layout**

Import `DownloadLeadGate` and render `<DownloadLeadGate lang={lang} />` immediately before `</body>`. Do not duplicate it inside guide pages.

- [ ] **Step 5: Run and commit**

Run: `npm run build && node --test tests/download-gate.test.mjs && npm test`

Expected: PT/EN gate tests and existing tests PASS.

```bash
git add src/components/DownloadLeadGate.astro src/components/GuideResources.astro src/layouts/BaseLayout.astro tests/download-gate.test.mjs
git commit -m "feat: add lightweight bilingual download gate"
```

## Task 8: Add accessible styling and privacy disclosures

**Files:**
- Modify: `src/styles/global.css`
- Create: `src/pages/privacidade.astro`
- Create: `src/pages/en/privacy.astro`
- Modify: `src/components/Footer.astro`
- Modify: `tests/download-gate.test.mjs`

- [ ] **Step 1: Extend tests for privacy and accessible CSS**

Assert `/privacidade/` and `/en/privacy/` build with one H1, canonical/hreflang, visible contact email, collection purpose, Resend, Cloudflare Turnstile, retention, access/correction/deletion instructions and the policy version `2026-07-22`. Assert both footer variants link to the matching page. Read CSS and assert `::backdrop`, `:focus-visible`, `@media (prefers-reduced-motion: reduce)` and mobile dialog rules exist.

- [ ] **Step 2: Add gate styles**

Create focused classes `.download-gate`, `.download-gate__header`, `__field`, `__consent`, `__actions`, `__status`, `__error` and `__close`. Use existing variables, minimum 44px interactive height, `max-width: min(34rem, calc(100vw - 2rem))`, `max-height: calc(100dvh - 2rem)`, internal vertical overflow, visible 2px focus and no motion when reduced-motion is requested.

- [ ] **Step 3: Publish both privacy pages**

Use `BaseLayout`; state the controller as Produto com IA / Rodrigo Tozato, contact `rodrigo.tozato@icloud.com`, data (email, consent choice, material/source/time), purposes, providers, período de retenção padrão de 730 dias, security, rights, how to request deletion, no sale/sharing, international processing by providers and the optional nature of marketing consent. Do not claim legal guarantees beyond implemented controls.

- [ ] **Step 4: Link policies in the footer**

Add one localized link next to editorial policy/corrections:

```astro
<a href={lang === 'pt-BR' ? '/privacidade/' : '/en/privacy/'}>
  {lang === 'pt-BR' ? 'Privacidade' : 'Privacy'}
</a>
```

- [ ] **Step 5: Run and commit**

Run: `npm run build && node --test tests/download-gate.test.mjs && npm run audit:dist`

Expected: privacy/gate/audit checks PASS.

```bash
git add src/styles/global.css src/pages/privacidade.astro src/pages/en/privacy.astro src/components/Footer.astro tests/download-gate.test.mjs
git commit -m "feat: disclose and style download lead capture"
```

## Task 9: Containerize and route the protected service

**Files:**
- Create: `services/download-leads/Dockerfile`
- Create: `deploy/download-leads.env.example`
- Modify: `deploy/docker-compose.yml`
- Modify: `deploy/nginx.conf`
- Create: `services/download-leads/test/container-contract.test.mjs`

- [ ] **Step 1: Write failing deployment contract tests**

Read Dockerfile/compose/nginx/env example and assert:

- service runs as non-root with `node:24`;
- compose mounts `./lead-data:/data` and `./private-downloads:/app/downloads:ro`;
- env file is `.env.download-leads` and no secret value is committed;
- nginx uses `proxy_pass http://download-leads:8787` for `/api/download-leads/` and `^~ /downloads/`;
- request body is at most 16 KiB;
- CSP allows `https://challenges.cloudflare.com` only in required directives;
- `/downloads/` is never handled by static `try_files`.

- [ ] **Step 2: Create the non-root Docker image**

Use:

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY services/download-leads/package.json ./package.json
COPY services/download-leads/src ./src
COPY config/downloads.json ./config/downloads.json
RUN chown -R node:node /app
USER node
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8787/api/download-leads/health || exit 1
CMD ["node", "src/server.mjs"]
```

- [ ] **Step 3: Extend Compose**

Add `download-leads` on the existing `proxy` network, `restart: unless-stopped`, `env_file: .env.download-leads`, read-only root filesystem, `tmpfs: /tmp`, `security_opt: no-new-privileges:true`, dropped capabilities, the two mounts, and healthcheck. Add `depends_on: download-leads: condition: service_healthy` to `produtocomia`.

- [ ] **Step 4: Add nginx routes and CSP**

Proxy both prefixes with `proxy_set_header Host $host`, `X-Real-IP $remote_addr`, `X-Forwarded-Proto $http_x_forwarded_proto`, `CF-Connecting-IP $http_cf_connecting_ip`, 10-second connect/read timeouts and `client_max_body_size 16k`. Add Turnstile to `script-src`, `frame-src` and `connect-src`; keep every existing source.

- [ ] **Step 5: Create the non-secret env contract**

`deploy/download-leads.env.example` lists variable names with valores descritivos não funcionais, `NOTIFICATION_MODE=resend`, retention/session values and never a working key.

- [ ] **Step 6: Run and commit**

Run: `npm run test:leads && docker compose -f deploy/docker-compose.yml config`

Expected: contract tests PASS and Compose renders when a temporary test env is supplied; no secrets appear in output committed to Git.

```bash
git add services/download-leads/Dockerfile services/download-leads/test/container-contract.test.mjs deploy
git commit -m "ops: run protected download service"
```

## Task 10: Make deployment atomic for site, service, database and private files

**Files:**
- Modify: `scripts/deploy.sh`
- Modify: `scripts/smoke-test.mjs`
- Modify: `scripts/audit-dist.mjs`
- Create: `tests/deploy-contract.test.mjs`

- [ ] **Step 1: Write failing deploy contract tests**

Assert the script:

- runs `npm run validate` before packaging;
- creates separate site/service archives and checks SHA-256;
- moves extracted `downloads` out of the public release before container start;
- backs up `html`, `private-downloads`, `nginx.conf`, `docker-compose.yml` and service source;
- never copies `.env.download-leads` from the repository;
- tests for the server-side env before changing production;
- uses `docker compose up -d --build` and waits for both containers;
- restores all swapped paths on smoke failure;
- keeps `lead-data` outside releases and never deletes it.

- [ ] **Step 2: Extend local packaging**

After validation, package `dist`, `services/download-leads`, `config/downloads.json`, compose and nginx. Upload to explicit `/tmp/produtocomia-<stamp>-*.tar.gz` paths. Do not interpolate secrets or broad paths.

- [ ] **Step 3: Extend remote activation**

On the VPS, verify `/home/rodrigo/apps/radar-ia/.env.download-leads` exists and is mode 600, create `lead-data` mode 700, extract into versioned release directories, move the new release's `downloads` to a versioned private directory, then atomically swap explicit paths. Preserve timestamped backups and restart through Compose.

- [ ] **Step 4: Extend rollback and smoke checks**

On any failed health/smoke check, stop the new stack, move failed paths into `releases/<stamp>-failed`, restore all timestamped backups and start the previous Compose stack. Never roll back or overwrite `lead-data` automatically.

Smoke tests must confirm:

```text
GET /, /en/, /guias/, /privacidade/, /en/privacy/ -> 200
GET /api/download-leads/health -> 200
GET /api/download-leads/config -> 200 without secret fields
GET /downloads/ai-risk-matrix.csv -> 200 HTML form, not CSV bytes
GET /api/download-leads/file/invalid -> 404
GET /llms.txt, /llms-full.txt, /sitemap-index.xml -> 200
```

- [ ] **Step 5: Run and commit**

Run: `node --test tests/deploy-contract.test.mjs && npm run validate`

Expected: deploy contracts and complete validation PASS.

```bash
git add scripts/deploy.sh scripts/smoke-test.mjs scripts/audit-dist.mjs tests/deploy-contract.test.mjs
git commit -m "ops: deploy lead capture with rollback"
```

## Task 11: Document activation, privacy operations and owner actions

**Files:**
- Create: `docs/operations/download-leads-runbook.md`
- Modify: `README.md`
- Modify: `services/download-leads/test/container-contract.test.mjs`

- [ ] **Step 1: Write the runbook content test**

Assert the runbook contains exact sections: `Resend`, `Cloudflare Turnstile`, `Variáveis do servidor`, `Teste de aceitação`, `Exportar leads`, `Excluir um lead`, `Backup`, `Restauração`, `Rotação de chaves`, `Incidente de segurança`, and explicitly names `rodrigo.tozato@icloud.com` plus `leads.produtocomia.com.br`.

- [ ] **Step 2: Write the operational runbook**

Document, without secrets:

1. Create/access Resend, add `leads.produtocomia.com.br`, copy SPF/DKIM records into Cloudflare, wait for verified status, create a sending-only API key.
2. In Cloudflare Turnstile create `Produto com IA — downloads`, allow only `produtocomia.com.br`, choose Managed with interaction-only appearance, copy site/secret keys.
3. On VPS create `/home/rodrigo/apps/radar-ia/.env.download-leads` from the example, insert secrets, generate `COOKIE_SECRET` with `openssl rand -hex 32`, and set mode 600.
4. Run service tests with Cloudflare test keys before production values.
5. Acceptance: use a private browser, submit one address, confirm immediate file, confirm owner email, download a second file without form, inspect analytics without PII, request deletion test.
6. Export only necessary fields from SQLite to a protected local file; never place exports under `html`.
7. Delete by normalized email using a reviewed maintenance command that cascades sessions/events.
8. Back up with SQLite backup API while service is live; encrypt off-server copies.
9. Rotate Resend, Turnstile and cookie secrets; note that cookie rotation signs out returning leads.
10. Incident steps: stop registration route, preserve logs/database, rotate keys, assess ANPD obligations, restore clean service.

- [ ] **Step 3: Update README**

Add one short section pointing developers to the design, plan and runbook; state that production publication requires the server-only env and that downloads must never be copied directly into the public nginx directory.

- [ ] **Step 4: Run and commit**

Run: `npm run test:leads && npm run validate`

Expected: runbook contract and all validation PASS.

```bash
git add docs/operations/download-leads-runbook.md README.md services/download-leads/test/container-contract.test.mjs
git commit -m "docs: add download lead operations runbook"
```

## Task 12: Final security, conversion and release verification

**Files:**
- Modify only if verification finds a defect; otherwise no source changes.

- [ ] **Step 1: Run complete local verification**

Run:

```bash
npm audit --omit=dev
npm run validate
npm --prefix services/download-leads test
docker build -f services/download-leads/Dockerfile -t produtocomia-download-leads:test .
```

Expected: no production dependency vulnerability, complete validation PASS, service tests PASS, image builds.

- [ ] **Step 2: Test the integrated local stack with test keys**

Create an untracked temporary env using Cloudflare's official always-pass test keys and `NOTIFICATION_MODE=log`; start Compose, run `scripts/smoke-test.mjs http://127.0.0.1` against the routed stack, register a synthetic `example.com` address, download two different files, verify one lead/two events and verify no email appears in nginx/analytics request URLs. Remove the temporary env after shutdown.

- [ ] **Step 3: Perform browser accessibility and responsive review**

At 360×800 and desktop:

- keyboard-only open, field entry, submit, close and focus return;
- screen-reader names for dialog, field, consent, status and errors;
- no horizontal overflow;
- reduced-motion behavior;
- PT and EN copy;
- first and returning download paths;
- Turnstile interaction-only behavior;
- privacy links and no forced marketing opt-in.

- [ ] **Step 4: Review SEO/GEO invariants**

Confirm guide/report pages remain 200, indexable, canonical, hreflang-linked and in the sitemap; `robots.txt`, `llms.txt` and `llms-full.txt` remain unrestricted; only raw files require the lead journey. Confirm no `noindex` or crawler-specific bypass was added.

- [ ] **Step 5: Review the branch diff and secrets**

Run:

```bash
git diff main...HEAD --check
git diff main...HEAD --stat
git grep -n -E 're_[A-Za-z0-9]{20,}|TURNSTILE_SECRET_KEY=.+|COOKIE_SECRET=.+' -- ':!deploy/download-leads.env.example'
git status --short
```

Expected: no whitespace errors, only planned files, secret scan empty, clean worktree.

- [ ] **Step 6: Prepare but do not publish without production credentials**

If Resend/Turnstile production values are absent, stop after delivering the four simple owner actions. Once configured, run `./scripts/deploy.sh`, confirm automated smoke tests, then manually submit a controlled address and confirm the notification arrives at `rodrigo.tozato@icloud.com` before announcing completion.

- [ ] **Step 7: Final commit only if verification required fixes**

If verification changed files, inspect `git status --short`, stage each reported source/test path explicitly, inspect `git diff --cached --check`, and commit with `git commit -m "fix: harden download lead release"`. Do not use `git add .` and do not create an empty verification commit.
