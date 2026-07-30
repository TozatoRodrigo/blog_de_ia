import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { buildNewsletterRedirectMap } from '../utils/newsletter-routes';

export function getStaticPaths() {
  return [{ params: { redirects: '_newsletter-redirects' } }];
}

export const GET: APIRoute = async () => {
  const [pt, en] = await Promise.all([
    getCollection('newsletters', ({ data }) => !data.draft),
    getCollection('newsletters-en', ({ data }) => !data.draft),
  ]);
  const body = [
    ...buildNewsletterRedirectMap('pt-BR', pt),
    ...buildNewsletterRedirectMap('en', en),
  ].sort().join('\n');

  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
