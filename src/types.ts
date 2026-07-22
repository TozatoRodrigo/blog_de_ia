import type { LStr, LArr } from './i18n/lang';

export interface RadarItem {
  title: string;
  description: string;
  url: string;
  tags: string[];
}

export interface NewsletterData {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
}

export interface TopicFAQ {
  question: LStr;
  answer: LStr;
}

export interface Topic {
  id: string;
  slug: LStr;
  name: LStr;
  description: LStr;
  shortDescription: LStr;
  keywords: LArr;
  faqs: TopicFAQ[];
}

export interface Concept {
  id: string;
  slug: LStr;
  term: LStr;
  definition: LStr;
  longDescription: LStr;
  category: LStr;
  relatedTerms: string[];
}
