import React, { useState } from 'react';
import { OFFICIAL_GUIDES } from '../data/guides';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

export const GuidesHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = [
    { id: 'todos', label: 'Todos os Guias' },
    { id: 'agentes', label: 'Agentes de IA' },
    { id: 'finops', label: 'FinOps & Custos' },
    { id: 'governanca', label: 'Governança & Risco' },
    { id: 'gestao', label: 'Gestão & SDD' },
  ];

  const filteredGuides = selectedCategory === 'todos'
    ? OFFICIAL_GUIDES
    : OFFICIAL_GUIDES.filter(g => g.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/25 font-semibold">
          BASE DE CONHECIMENTO DO PRODUTO COM IA
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink font-sans">
          Biblioteca Oficial de Guias Técnicos
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Artigos profundos, auditorias e frameworks mantidos pelo editor Rodrigo Tozato em <a href="https://www.produtocomia.com.br" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">produtocomia.com.br</a>. Conecte cada simulação à sua fonte teórica.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
              selectedCategory === cat.id
                ? 'bg-accent text-paper font-bold  shadow-accent/25'
                : 'bg-paperalt text-muted border border-ink/20 hover:border-ink/25 hover:text-ink'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="bg-paperalt p-5  border border-ink/20 hover:border-accent/55 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/25 font-semibold">
                  {guide.badge}
                </span>
                <span className="text-[11px] font-mono text-muted uppercase">
                  {guide.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-ink group-hover:text-accent transition-colors mb-2 font-sans">
                {guide.title}
              </h3>

              <p className="text-xs text-muted leading-relaxed mb-4">
                {guide.description}
              </p>

              {/* Highlights */}
              <div className="bg-paper p-3  border border-ink/20 mb-4 space-y-1.5 text-xs">
                <span className="font-mono text-[10px] uppercase text-muted block font-bold">
                  Destaques do Guia:
                </span>
                {guide.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-inksoft text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={guide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full p-2.5 rounded bg-paperalt hover:bg-accentdark text-inksoft hover:text-paper text-xs font-mono font-semibold transition-all"
            >
              <span>Ler Guia Completo no Site Oficial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

    </div>
  );
};
