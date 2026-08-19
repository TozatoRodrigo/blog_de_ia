import { readFile } from 'node:fs/promises';

function validateItem(item, index) {
  if (!item || typeof item !== 'object') throw new Error(`catalog item ${index} must be an object`);
  if (!/^[a-z0-9-]+$/.test(item.id ?? '')) throw new Error(`catalog item ${index} has an invalid id`);
  if (!item.filename || /[/\\]/.test(item.filename) || item.filename.includes('..')) {
    throw new Error(`catalog item ${index} has an unsafe filename`);
  }
  if (!/^(application|text)\//.test(item.contentType ?? '')) {
    throw new Error(`catalog item ${index} has an invalid content type`);
  }
  if (!['pt-BR', 'en'].includes(item.language)) {
    throw new Error(`catalog item ${index} requires a valid language`);
  }
  if (!item.labels?.['pt-BR'] || !item.labels?.en) {
    throw new Error(`catalog item ${index} requires pt-BR and en labels`);
  }
  if (!item.description?.['pt-BR'] || !item.description?.en) {
    throw new Error(`catalog item ${index} requires pt-BR and en descriptions`);
  }
  if (!/^\/[^?]+\/$/.test(item.relatedUrl?.['pt-BR'] ?? '') || !/^\/en\/[^?]+\/$/.test(item.relatedUrl?.en ?? '')) {
    throw new Error(`catalog item ${index} requires localized related URLs`);
  }

  return Object.freeze({
    id: item.id,
    filename: item.filename,
    language: item.language,
    contentType: item.contentType,
    labels: Object.freeze({ 'pt-BR': item.labels['pt-BR'], en: item.labels.en }),
    description: Object.freeze({ 'pt-BR': item.description['pt-BR'], en: item.description.en }),
    relatedUrl: Object.freeze({ 'pt-BR': item.relatedUrl['pt-BR'], en: item.relatedUrl.en }),
  });
}

export async function loadCatalog(path) {
  const parsed = JSON.parse(await readFile(path, 'utf8'));
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('download catalog must be a non-empty array');

  const items = Object.freeze(parsed.map(validateItem));
  const byId = new Map();
  const byFilename = new Map();

  for (const item of items) {
    if (byId.has(item.id)) throw new Error(`duplicate catalog id: ${item.id}`);
    if (byFilename.has(item.filename)) throw new Error(`duplicate catalog filename: ${item.filename}`);
    byId.set(item.id, item);
    byFilename.set(item.filename, item);
  }

  return Object.freeze({ items, byId, byFilename });
}
