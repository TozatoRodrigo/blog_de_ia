import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { concepts } from '../data/concepts';
import { topics } from '../data/topics';

export const GET: APIRoute = async () => {
  const [pt, en, guidesPt, guidesEn] = await Promise.all([
    getCollection('newsletters', ({ data }) => !data.draft),
    getCollection('newsletters-en', ({ data }) => !data.draft),
    getCollection('guides', ({ data }) => !data.draft),
    getCollection('guides-en', ({ data }) => !data.draft),
  ]);
  const editions = [...pt.map((entry) => ({ ...entry, base: '/newsletter/' })), ...en.map((entry) => ({ ...entry, base: '/en/newsletter/' }))]
    .sort((a, b) => b.data.date.localeCompare(a.data.date))
    .map((entry) => `## ${entry.data.title}\nURL: https://produtocomia.com.br${entry.base}${entry.id}/\nData: ${entry.data.date}\nResumo: ${entry.data.excerpt}\nTópicos: ${entry.data.tags.join(', ')}`);
  const guides = [
    ...guidesPt.map((entry) => ({ ...entry, base: '/guias/', language: 'pt-BR' })),
    ...guidesEn.map((entry) => ({ ...entry, base: '/en/guides/', language: 'en' })),
  ].sort((a, b) => a.data.title.localeCompare(b.data.title)).map((entry) => `## ${entry.data.title}\nURL: https://produtocomia.com.br${entry.base}${entry.id}/\nIdioma: ${entry.language}\nAtualizado: ${entry.data.dateModified}\nResumo: ${entry.data.description}\nTópicos: ${entry.data.tags.join(', ')}\n\n${entry.body}`);
  const body = `# Produto com IA — corpus editorial expandido

Autor e editor: Rodrigo Tozato. Foco: inteligência artificial para Product Managers, governança, custos, agentes e estratégia de produto.

## Política de uso e citação
Rastreamento é permitido. Ao reutilizar fatos, análises ou frameworks, cite a URL canônica correspondente. Conteúdo editorial separa fatos atribuídos, análise do autor e recomendações. Correções: https://produtocomia.com.br/correcoes/

# Taxonomia
${topics.map((topic) => `## ${topic.name['pt-BR']}\n${topic.description['pt-BR']}\nURL: https://produtocomia.com.br/topicos/${topic.slug['pt-BR']}/`).join('\n\n')}

# Glossário
${concepts.map((concept) => `## ${concept.term['pt-BR']}\n${concept.definition['pt-BR']}\nURL: https://produtocomia.com.br/conceitos/${concept.slug['pt-BR']}/`).join('\n\n')}

# Guias aprofundados
${guides.join('\n\n')}

# Edições publicadas
${editions.join('\n\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
