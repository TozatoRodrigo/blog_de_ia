const RESEND_EMAIL_URL = 'https://api.resend.com/emails';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function valueOrDash(value) {
  return value === undefined || value === null || value === '' ? '—' : String(value);
}

function formatSãoPaulo(isoDate) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(isoDate));
}

function message({ event, lead, material }) {
  const label = material.labels[event.lang] ?? material.labels['pt-BR'];
  const fields = [
    ['E-mail', lead.email],
    ['Material', label],
    ['Página de origem', event.sourcePath],
    ['Idioma', event.lang],
    ['Campanha', valueOrDash(event.campaign)],
    ['Data e hora', formatSãoPaulo(event.createdAt)],
    ['Autorizou novidades', lead.marketingOptIn ? 'sim' : 'não'],
  ];
  return {
    label,
    text: fields.map(([name, value]) => `${name}: ${valueOrDash(value)}`).join('\n'),
    html: `<h1>Novo download</h1><dl>${fields
      .map(([name, value]) => `<dt><strong>${escapeHtml(name)}</strong></dt><dd>${escapeHtml(valueOrDash(value))}</dd>`)
      .join('')}</dl>`,
  };
}

function operationalError(code) {
  const error = new Error(`Download notification failed (${code})`);
  error.code = String(code).slice(0, 120);
  return error;
}

export function createNotifier({ apiKey, from, to, mode = 'resend', fetchImpl = fetch }) {
  return Object.freeze({
    async sendDownloadNotification({ event, lead, material }) {
      if (mode === 'log') return { id: 'logged' };

      const content = message({ event, lead, material });
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);
      try {
        const response = await fetchImpl(RESEND_EMAIL_URL, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${apiKey}`,
            'content-type': 'application/json',
            'idempotency-key': `download-event/${event.id}`,
          },
          body: JSON.stringify({
            from,
            to: [to],
            subject: `Novo download: ${content.label}`,
            text: content.text,
            html: content.html,
          }),
          signal: controller.signal,
        });
        if (!response.ok) throw operationalError(`resend_http_${response.status}`);
        const result = await response.json();
        if (!result?.id || typeof result.id !== 'string') throw operationalError('resend_invalid_response');
        return { id: result.id };
      } catch (error) {
        if (error?.code?.startsWith('resend_')) throw error;
        throw operationalError(error?.name === 'AbortError' ? 'resend_timeout' : 'resend_network');
      } finally {
        clearTimeout(timeout);
      }
    },
  });
}

export async function runNotificationBatch({ db, notifier, catalog, limit = 20 }) {
  let sent = 0;
  let failed = 0;

  for (const event of db.pendingNotifications(limit)) {
    const lead = db.findLeadById(event.leadId);
    const material = catalog.byId.get(event.materialId);
    if (!lead || !material) {
      db.markNotificationFailed(event.id, !lead ? 'lead_not_found' : 'material_not_found');
      failed += 1;
      continue;
    }

    try {
      await notifier.sendDownloadNotification({ event, lead, material });
      db.markNotificationSent(event.id);
      sent += 1;
    } catch (error) {
      db.markNotificationFailed(event.id, error?.code ?? 'notification_unknown');
      failed += 1;
    }
  }

  return { sent, failed };
}
