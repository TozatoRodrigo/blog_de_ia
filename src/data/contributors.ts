export interface Contributor {
  id: string;
  name: string;
  role: string;
  bio: string;
  roleEn: string;
  bioEn: string;
  site?: string;
  links: Array<{ label: string; href: string }>;
}

export const contributors: Record<string, Contributor> = {
  'ricardo-guia': {
    id: 'ricardo-guia',
    name: 'Ricardo Guia',
    role: 'Executivo de produto e autor da Inteligência à Brasileira',
    bio: 'Ricardo Guia é executivo de produto e autor da Inteligência à Brasileira, onde escreve sobre IA a partir do olhar de quem constrói sistemas e produtos com ela.',
    roleEn: 'Product executive and author of Inteligência à Brasileira',
    bioEn: 'Ricardo Guia is a product executive and author of Inteligência à Brasileira, where he writes about AI from the perspective of someone who builds systems and products with it.',
    site: 'https://ricardoguia.com/',
    links: [
      { label: 'Inteligência à Brasileira', href: 'https://iabrasileira.com/' },
      { label: 'ricardoguia.com', href: 'https://ricardoguia.com/' },
    ],
  },
};

export function contributorFor(id: string): Contributor {
  const contributor = contributors[id];
  if (!contributor) throw new Error(`unknown-contributor:${id}`);
  return contributor;
}
