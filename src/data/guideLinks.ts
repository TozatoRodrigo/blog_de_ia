import type { Lang } from '../i18n/lang';

const guides = {
  product: { pt: 'gestao-de-produtos-com-ia', en: 'ai-product-management', ptTitle: 'Gestão de produtos com IA', enTitle: 'AI product management' },
  governance: { pt: 'governanca-de-ia', en: 'ai-governance', ptTitle: 'Governança de IA', enTitle: 'AI governance' },
  pm: { pt: 'inteligencia-artificial-para-product-managers', en: 'artificial-intelligence-for-product-managers', ptTitle: 'IA para Product Managers', enTitle: 'AI for Product Managers' },
} as const;

export function guideForTag(tag: string, lang: Lang) {
  const key = ['governanca-de-ia', 'seguranca-de-ia'].includes(tag) ? 'governance'
    : ['produto', 'automacao', 'adocao-de-ia'].includes(tag) ? 'product' : 'pm';
  const guide = guides[key];
  return { href: lang === 'pt-BR' ? `/guias/${guide.pt}/` : `/en/guides/${guide.en}/`, title: lang === 'pt-BR' ? guide.ptTitle : guide.enTitle };
}
