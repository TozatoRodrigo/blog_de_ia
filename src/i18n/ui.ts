import type { Lang } from './lang';

type Dict = Record<string, { 'pt-BR': string; 'en': string }>;

export const UI: Dict = {
  // Header / Nav
  'nav.home': { 'pt-BR': 'Início', 'en': 'Home' },
  'nav.newsletter': { 'pt-BR': 'Newsletter', 'en': 'Newsletter' },
  'nav.topics': { 'pt-BR': 'Tópicos', 'en': 'Topics' },
  'nav.concepts': { 'pt-BR': 'Conceitos', 'en': 'Concepts' },
  'nav.about': { 'pt-BR': 'Sobre', 'en': 'About' },
  'nav.menu': { 'pt-BR': 'MENU', 'en': 'MENU' },
  'nav.close': { 'pt-BR': 'Fechar menu', 'en': 'Close menu' },

  // Hero
  'hero.eyebrow': { 'pt-BR': 'EDIÇÃO DIÁRIA', 'en': 'DAILY EDITION' },
  'hero.title1': { 'pt-BR': 'Inteligência', 'en': 'Intelligence' },
  'hero.title2': { 'pt-BR': 'Artificial para', 'en': 'Artificial for' },
  'hero.title3': { 'pt-BR': 'Product Managers', 'en': 'Product Managers' },
  'hero.sub': {
    'pt-BR':
      'Curadoria diária de IA, produto e tecnologia para PMs, POs e líderes de produto. Análises profundas, radar de notícias e insights acionáveis — sem hype, com dado real.',
    'en': 'Daily curation of AI, product, and technology for PMs, POs, and product leaders. In-depth analysis, news radar, and actionable insights — no hype, real data.',
  },
  'hero.cta1': { 'pt-BR': 'VER EDIÇÕES', 'en': 'VIEW EDITIONS' },
  'hero.cta2': { 'pt-BR': 'EXPLORAR TÓPICOS', 'en': 'EXPLORE TOPICS' },
  'hero.editions': { 'pt-BR': 'EDIÇÕES PUBLICADAS', 'en': 'EDITIONS PUBLISHED' },
  'hero.topics': { 'pt-BR': 'TÓPICOS COBERTOS', 'en': 'TOPICS COVERED' },
  'hero.concepts': { 'pt-BR': 'CONCEITOS', 'en': 'CONCEPTS' },
  'hero.frequency': { 'pt-BR': 'FREQUÊNCIA', 'en': 'FREQUENCY' },
  'hero.daily': { 'pt-BR': 'DIÁRIO', 'en': 'DAILY' },

  // Sections
  'section.latest': { 'pt-BR': 'EDIÇÃO MAIS RECENTE', 'en': 'LATEST EDITION' },
  'section.latestTitle': { 'pt-BR': 'Destaque de hoje', 'en': "Today's highlight" },
  'section.archive': { 'pt-BR': 'VER ARQUIVO COMPLETO', 'en': 'VIEW FULL ARCHIVE' },
  'section.recent': { 'pt-BR': 'ARQUIVO RECENTE', 'en': 'RECENT ARCHIVE' },
  'section.recentTitle': { 'pt-BR': 'Edições anteriores', 'en': 'Previous editions' },
  'section.coverage': { 'pt-BR': 'MAPA DE COBERTURA', 'en': 'COVERAGE MAP' },
  'section.topicsTitle': { 'pt-BR': 'Tópicos', 'en': 'Topics' },
  'section.glossary': { 'pt-BR': 'GLOSSÁRIO', 'en': 'GLOSSARY' },
  'section.conceptsTitle': { 'pt-BR': 'Conceitos', 'en': 'Concepts' },
  'section.viewAll': { 'pt-BR': 'VER TODOS', 'en': 'VIEW ALL' },
  'section.questions': { 'pt-BR': 'PERGUNTAS', 'en': 'QUESTIONS' },
  'section.keywords': { 'pt-BR': 'KEYWORDS', 'en': 'KEYWORDS' },
  'section.connect': { 'pt-BR': 'CONECTE-SE', 'en': 'CONNECT' },
  'section.newEdition': { 'pt-BR': 'NOVA EDIÇÃO', 'en': 'NEW EDITION' },
  'section.edition': { 'pt-BR': 'EDIÇÃO', 'en': 'EDITION' },

  // CTA
  'cta.title1': { 'pt-BR': 'Acompanhe o radar', 'en': 'Follow the radar' },
  'cta.title2': { 'pt-BR': 'todos os dias', 'en': 'every day' },
  'cta.sub': {
    'pt-BR': 'Receba a curadoria diária de IA, produto e tecnologia no seu LinkedIn.',
    'en': 'Get the daily curation of AI, product, and technology on your LinkedIn.',
  },
  'cta.linkedin': { 'pt-BR': 'SEGUIR NO LINKEDIN', 'en': 'FOLLOW ON LINKEDIN' },

  // Newsletter article
  'article.edition': { 'pt-BR': 'EDIÇÃO', 'en': 'EDITION' },
  'article.by': { 'pt-BR': 'POR', 'en': 'BY' },
  'article.readComplete': { 'pt-BR': 'LER EDIÇÃO COMPLETA', 'en': 'READ FULL EDITION' },
  'article.tags': { 'pt-BR': 'TAGS', 'en': 'TAGS' },
  'article.relatedTopics': { 'pt-BR': 'TÓPICOS RELACIONADOS', 'en': 'RELATED TOPICS' },
  'article.aboutAuthor': { 'pt-BR': 'SOBRE O AUTOR', 'en': 'ABOUT THE AUTHOR' },
  'article.prev': { 'pt-BR': 'ANTERIOR', 'en': 'PREVIOUS' },
  'article.next': { 'pt-BR': 'PRÓXIMA', 'en': 'NEXT' },
  'article.authorBio': {
    'pt-BR':
      'Escreve diariamente sobre IA, produto e fintech com foco em dado real, não hype.',
    'en': 'Writes daily about AI, product, and fintech with a focus on real data, not hype.',
  },
  'article.min': { 'pt-BR': 'MIN', 'en': 'MIN' },
  'article.radarTitle': { 'pt-BR': 'O resto do radar', 'en': 'The rest of the radar' },
  'article.readMore': { 'pt-BR': 'Ler mais', 'en': 'Read more' },
  'article.conclusion.default': {
    'pt-BR': 'Isso foi o que separei hoje. Amanhã tem mais.',
    'en': "That's what I selected today. More tomorrow.",
  },

  // Topic page
  'topic.label': { 'pt-BR': 'TÓPICO', 'en': 'TOPIC' },
  'topic.relatedNews': { 'pt-BR': 'EDIÇÕES RELACIONADAS', 'en': 'RELATED EDITIONS' },
  'topic.faq': { 'pt-BR': 'PERGUNTAS FREQUENTES', 'en': 'FREQUENTLY ASKED QUESTIONS' },
  'topic.faqTitle': { 'pt-BR': 'FAQ', 'en': 'FAQ' },
  'topic.relatedConcepts': { 'pt-BR': 'CONCEITOS RELACIONADOS', 'en': 'RELATED CONCEPTS' },
  'topic.glossaryTitle': { 'pt-BR': 'Glossário', 'en': 'Glossary' },

  // Concept page
  'concept.whatIs': { 'pt-BR': 'O que é', 'en': 'What is' },
  'concept.category': { 'pt-BR': 'CATEGORIA', 'en': 'CATEGORY' },
  'concept.detailed': { 'pt-BR': 'Explicação detalhada', 'en': 'Detailed explanation' },
  'concept.readDef': { 'pt-BR': 'LER DEFINIÇÃO', 'en': 'READ DEFINITION' },
  'concept.relatedTerms': { 'pt-BR': 'TERMOS RELACIONADOS', 'en': 'RELATED TERMS' },

  // Newsletter listing
  'newsletter.archive': { 'pt-BR': 'ARQUIVO COMPLETO', 'en': 'FULL ARCHIVE' },
  'newsletter.title': { 'pt-BR': 'Newsletter', 'en': 'Newsletter' },
  'newsletter.description': {
    'pt-BR':
      'Curadoria diária de inteligência artificial, produto e tecnologia. Cada edição traz uma análise profunda sobre um tema relevante e um radar com as notícias mais importantes do dia.',
    'en': 'Daily curation of artificial intelligence, product, and technology. Each edition features an in-depth analysis of a relevant topic and a radar with the most important news of the day.',
  },
  'newsletter.editions': { 'pt-BR': 'EDIÇÕES', 'en': 'EDITIONS' },

  // Topics listing
  'topics.coverageMap': { 'pt-BR': 'MAPA DE COBERTURA', 'en': 'COVERAGE MAP' },
  'topics.title': { 'pt-BR': 'Tópicos', 'en': 'Topics' },
  'topics.description': {
    'pt-BR':
      'Cada tópico reúne análises, cases, perguntas frequentes e notícias relacionadas. Use como ponto de partida para explorar um tema a fundo.',
    'en': 'Each topic brings together analysis, case studies, frequently asked questions, and related news. Use as a starting point to explore a topic in depth.',
  },

  // Concepts listing
  'concepts.glossary': { 'pt-BR': 'GLOSSÁRIO', 'en': 'GLOSSARY' },
  'concepts.title': { 'pt-BR': 'Conceitos', 'en': 'Concepts' },
  'concepts.description': {
    'pt-BR':
      'Definições claras e contextuais dos termos de IA que todo product manager deveria conhecer. Cada conceito inclui explicação aprofundada com cases reais e referências.',
    'en': 'Clear and contextual definitions of AI terms every product manager should know. Each concept includes an in-depth explanation with real cases and references.',
  },
  'concepts.terms': { 'pt-BR': 'TERMOS', 'en': 'TERMS' },

  // About page
  'about.whoBehind': { 'pt-BR': 'Quem está por trás', 'en': 'Who is behind this' },

  // Footer
  'footer.nav': { 'pt-BR': 'NAVEGAÇÃO', 'en': 'NAVIGATION' },
  'footer.topics': { 'pt-BR': 'TÓPICOS', 'en': 'TOPICS' },
  'footer.contact': { 'pt-BR': 'CONTATO', 'en': 'CONTACT' },
  'footer.rights': {
    'pt-BR': 'TODOS OS DIREITOS RESERVADOS',
    'en': 'ALL RIGHTS RESERVED',
  },

  // 404
  '404.title': { 'pt-BR': '404', 'en': '404' },
  '404.message': {
    'pt-BR': 'Esta página não existe, foi movida ou nunca existiu. O sinal não foi encontrado nesta frequência.',
    'en': "This page doesn't exist, was moved, or never existed. Signal not found on this frequency.",
  },
  '404.backHome': { 'pt-BR': 'VOLTAR AO INÍCIO', 'en': 'BACK TO HOME' },
  '404.signalLost': { 'pt-BR': 'SIGNAL LOST — UNIT NOT FOUND', 'en': 'SIGNAL LOST — UNIT NOT FOUND' },
  '404.error': { 'pt-BR': 'ERRO 404', 'en': 'ERROR 404' },

  // Language switcher
  'lang.switch': { 'pt-BR': 'Português', 'en': 'English' },
  'lang.skipToContent': { 'pt-BR': 'Pular para o conteúdo', 'en': 'Skip to content' },
  'lang.backToTop': { 'pt-BR': 'Voltar ao topo', 'en': 'Back to top' },
};

export function ui(key: string, lang: Lang): string {
  const entry = UI[key];
  if (!entry) return key;
  return entry[lang];
}
