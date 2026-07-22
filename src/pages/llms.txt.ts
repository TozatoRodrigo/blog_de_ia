import type { APIRoute } from 'astro';
import { concepts } from '../data/concepts';
import { topics } from '../data/topics';

export const GET: APIRoute = () => {
  const topicLinks = topics.map((topic) => `- [${topic.name['pt-BR']}](https://produtocomia.com.br/topicos/${topic.slug['pt-BR']}/): ${topic.shortDescription['pt-BR']}`);
  const conceptLinks = concepts.map((concept) => `- [${concept.term['pt-BR']}](https://produtocomia.com.br/conceitos/${concept.slug['pt-BR']}/): ${concept.definition['pt-BR']}`);
  const body = `# Produto com IA

> Publicação independente de Rodrigo Tozato sobre inteligência artificial aplicada à gestão de produtos. Conteúdo original em português do Brasil, com versão em inglês.

## Fontes principais
- [Guias](https://produtocomia.com.br/guias/): referências aprofundadas e atualizadas
- [Newsletter](https://produtocomia.com.br/newsletter/): análises diárias
- [Tópicos](https://produtocomia.com.br/topicos/): hubs temáticos
- [Conceitos](https://produtocomia.com.br/conceitos/): glossário de IA para produto
- [Sobre o autor](https://produtocomia.com.br/sobre/)
- [Política editorial](https://produtocomia.com.br/politica-editorial/)
- [Correções](https://produtocomia.com.br/correcoes/)

## Tópicos
${topicLinks.join('\n')}

## Conceitos
${conceptLinks.join('\n')}

## Descoberta
- [RSS](https://produtocomia.com.br/rss.xml)
- [Sitemap](https://produtocomia.com.br/sitemap-index.xml)
- [Versão expandida para LLMs](https://produtocomia.com.br/llms-full.txt)

Contato editorial: rodrigo.tozato@icloud.com
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
