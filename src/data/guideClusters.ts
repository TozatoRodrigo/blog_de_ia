import type { Lang } from '../i18n/lang';

export const guideClusters = [
  {
    id: 'agents',
    name: { 'pt-BR': 'Agentes de IA', en: 'AI Agents' },
    description: {
      'pt-BR': 'Entenda, construa, avalie e opere agentes de IA com objetivos e limites claros.',
      en: 'Understand, build, evaluate and operate AI agents with clear goals and boundaries.',
    },
    hub: { pt: 'agentes-de-ia', en: 'ai-agents' },
    items: [
      { pt: 'agentes-de-ia', en: 'ai-agents' },
      { pt: 'como-criar-agentes-de-ia', en: 'how-to-build-ai-agents' },
      { pt: 'agentes-de-ia-com-n8n', en: 'ai-agents-with-n8n' },
      { pt: 'exemplos-de-agentes-de-ia', en: 'ai-agent-examples' },
      { pt: 'template-avaliacao-agente-de-ia', en: 'ai-agent-evaluation-template' },
    ],
  },
  {
    id: 'governance',
    name: { 'pt-BR': 'Governança de IA', en: 'AI Governance' },
    description: {
      'pt-BR': 'Transforme princípios de IA responsável em decisões, controles e evidências operacionais.',
      en: 'Turn responsible AI principles into operational decisions, controls and evidence.',
    },
    hub: { pt: 'governanca-de-ia', en: 'ai-governance' },
    items: [
      { pt: 'governanca-de-ia', en: 'ai-governance' },
      { pt: 'checklist-governanca-de-ia', en: 'ai-governance-checklist' },
      { pt: 'matriz-risco-ia', en: 'ai-risk-matrix' },
      { pt: 'inventario-sistemas-de-ia', en: 'ai-system-inventory' },
    ],
  },
  {
    id: 'product',
    name: { 'pt-BR': 'Gestão de Produto', en: 'Product Management' },
    description: {
      'pt-BR': 'Conecte estratégia, discovery, entrega e métricas ao uso responsável de inteligência artificial.',
      en: 'Connect strategy, discovery, delivery and metrics to the responsible use of artificial intelligence.',
    },
    hub: { pt: 'gestao-de-produto', en: 'product-management' },
    items: [
      { pt: 'gestao-de-produto', en: 'product-management' },
      { pt: 'gestao-de-produtos-com-ia', en: 'ai-product-management' },
      { pt: 'inteligencia-artificial-para-product-managers', en: 'artificial-intelligence-for-product-managers' },
      { pt: 'estado-ia-gestao-de-produto-2026', en: 'state-of-ai-in-product-management-2026' },
    ],
  },
] as const;

export type GuideCluster = (typeof guideClusters)[number];

export function clusterForGuide(slug: string, lang: Lang): GuideCluster | undefined {
  const key = lang === 'pt-BR' ? 'pt' : 'en';
  return guideClusters.find((cluster) => cluster.items.some((item) => item[key] === slug));
}

export function guidePair(slug: string, lang: Lang) {
  const key = lang === 'pt-BR' ? 'pt' : 'en';
  const alternateKey = lang === 'pt-BR' ? 'en' : 'pt';
  for (const cluster of guideClusters) {
    const item = cluster.items.find((entry) => entry[key] === slug);
    if (item) return { current: item[key], alternate: item[alternateKey] };
  }
  return undefined;
}
