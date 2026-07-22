import { SITE, SITE_LOCALE } from '../config.ts';
import type { Lang } from '../i18n/lang.ts';
import { absoluteUrl } from './seo.ts';

export const IDS = {
  organization: `${SITE.url}/#organization`,
  person: `${SITE.url}/#person-rodrigo-tozato`,
  website: `${SITE.url}/#website`,
} as const;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': IDS.organization,
    name: SITE.name, url: `${SITE.url}/`, logo: { '@type': 'ImageObject', url: absoluteUrl('/og/default.png'), width: 1200, height: 630 },
    founder: { '@id': IDS.person }, sameAs: [SITE.linkedin], email: SITE.email,
  };
}

export function personSchema() {
  return {
    '@context': 'https://schema.org', '@type': 'Person', '@id': IDS.person,
    name: SITE.author, url: absoluteUrl('/sobre/'), jobTitle: SITE.authorRole,
    worksFor: { '@id': IDS.organization }, sameAs: [SITE.linkedin],
    knowsAbout: ['inteligência artificial', 'gestão de produtos', 'governança de IA', 'FinOps de IA'],
  };
}

export function websiteSchema(lang: Lang) {
  return {
    '@context': 'https://schema.org', '@type': 'WebSite', '@id': IDS.website,
    name: SITE.name, url: `${SITE.url}/`, description: SITE_LOCALE[lang].description,
    inLanguage: lang === 'en' ? 'en' : 'pt-BR', publisher: { '@id': IDS.organization },
  };
}

interface ArticleInput {
  url: string; title: string; description: string; datePublished: string; dateModified: string;
  image: string; lang: Lang; tags?: string[];
}

export function blogPostingSchema(input: ArticleInput) {
  const url = absoluteUrl(input.url);
  return {
    '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#article`,
    headline: input.title, description: input.description,
    datePublished: input.datePublished, dateModified: input.dateModified,
    inLanguage: input.lang === 'en' ? 'en' : 'pt-BR', keywords: (input.tags || []).join(', '),
    image: { '@type': 'ImageObject', url: absoluteUrl(input.image), width: 1200, height: 630 },
    author: { '@id': IDS.person }, publisher: { '@id': IDS.organization },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }, isPartOf: { '@id': IDS.website },
  };
}

export const articleSchema = blogPostingSchema;

export function breadcrumbSchema(items: Array<[string, string]>) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, item], index) => ({ '@type': 'ListItem', position: index + 1, name, item: absoluteUrl(item) })),
  };
}

export function faqPageSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function howToSchema(input: {
  name: string; description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: input.name, description: input.description,
    step: input.steps.map((step, index) => ({
      '@type': 'HowToStep', position: index + 1, name: step.name, text: step.text,
    })),
  };
}

export function definedTermSchema(input: { name: string; description: string; url: string; lang: Lang }) {
  return {
    '@context': 'https://schema.org', '@type': 'DefinedTerm', '@id': `${absoluteUrl(input.url)}#term`,
    name: input.name, description: input.description, url: absoluteUrl(input.url),
    inDefinedTermSet: absoluteUrl(input.lang === 'en' ? '/en/concepts/' : '/conceitos/'),
    inLanguage: input.lang === 'en' ? 'en' : 'pt-BR',
  };
}
