import React from 'react';
import { ExternalLink, Terminal, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-ink text-paper border-t-2 border-ink">
      <div className="warning-stripe" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs font-mono">

        {/* Col 1: Brand & Purpose */}
        <div className="space-y-3 md:col-span-2">
          <h4 className="font-display text-base tracking-tight">
            PRODUTO COM <span className="text-accent">IA</span>
            <span className="ml-2 align-middle inline-block px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-paper/30 text-paper/70">
              Arena PM
            </span>
          </h4>
          <p className="text-paper/70 leading-relaxed max-w-lg">
            Ambiente prático para capacitação de novos Product Managers e profissionais em transição de carreira para o paradigma <strong className="text-paper">AI-First</strong>. Sem superficialidade: métricas de inferência, governança de agentes, FinOps, Evals e Spec-Driven Development.
          </p>
          <div className="pt-2 text-paper/50 flex items-center gap-2 uppercase tracking-wider text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-accent" />
            <span>Editor — <strong className="text-paper/80">Rodrigo Tozato</strong> · PM · Crédito &amp; Recebíveis</span>
          </div>
        </div>

        {/* Col 2: Ecossistema */}
        <div className="space-y-2">
          <h4 className="text-paper uppercase font-bold text-xs tracking-widest">Ecossistema</h4>
          <ul className="space-y-1.5">
            <li>
              <a
                href="https://www.produtocomia.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent flex items-center gap-1 transition-colors text-paper/70"
              >
                Portal Oficial <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://www.produtocomia.com.br/newsletter"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent flex items-center gap-1 transition-colors text-paper/70"
              >
                Radar Diário <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://www.produtocomia.com.br/guias"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent flex items-center gap-1 transition-colors text-paper/70"
              >
                Biblioteca de Guias <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://www.produtocomia.com.br/topicos"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent flex items-center gap-1 transition-colors text-paper/70"
              >
                Tópicos <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Diretrizes Técnicas */}
        <div className="space-y-2">
          <h4 className="text-paper uppercase font-bold text-xs tracking-widest">Metodologia AI-First</h4>
          <p className="text-paper/60 text-[11px] leading-relaxed">
            "Sistemas estocásticos exigem gestão de riscos probabilísticos. O AI PM não gerencia apenas telas ou histórias de usuário, gerencia a incerteza e o balanço contábil da inteligência artificial."
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink bg-paper px-2 py-1 border-2 border-paper font-bold">
              <ShieldAlert className="w-3 h-3 text-accent" /> Sem Hype. Com Dado Real.
            </span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-8 pt-6 border-t border-paper/20 flex flex-col sm:flex-row items-center justify-between text-paper/50 text-[11px] font-mono uppercase tracking-wider gap-3">
        <div>
          © {new Date().getFullYear()} Produto com IA — Todos os direitos reservados.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <a href="https://www.produtocomia.com.br/sobre" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Sobre o Editor</a>
          <span>·</span>
          <a href="https://www.produtocomia.com.br/politica-editorial" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Política Editorial</a>
          <span>·</span>
          <a href="https://www.produtocomia.com.br/privacidade" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Privacidade</a>
        </div>
        <div>
          Construído por{' '}
          <a
            href="https://www.striviumtech.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-paper/80 hover:text-accent font-bold transition-colors"
          >
            Strivium Tech
          </a>
        </div>
      </div>
    </footer>
  );
};
