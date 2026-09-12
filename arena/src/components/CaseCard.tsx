import React from 'react';
import type { AICase } from '../types';
import { ArrowRight, Clock, CheckCircle2, ShieldCheck, Cpu, Database, DollarSign, Target } from 'lucide-react';

interface CaseCardProps {
  caseData: AICase;
  isCompleted: boolean;
  onSelect: (caseId: string) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  caseData,
  isCompleted,
  onSelect,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'finops':
        return <DollarSign className="w-3.5 h-3.5 text-amber-700" />;
      case 'evals':
        return <Target className="w-3.5 h-3.5 text-purple-700" />;
      case 'governanca':
        return <ShieldCheck className="w-3.5 h-3.5 text-rose-700" />;
      case 'sdd':
        return <Database className="w-3.5 h-3.5 text-cyan-700" />;
      case 'agentes':
      default:
        return <Cpu className="w-3.5 h-3.5 text-accent" />;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'bg-accent/10 text-accent border-accent/35';
      case 'Intermediário':
        return 'bg-amber-500/15 text-amber-700 border-amber-600/35';
      case 'Avançado':
        return 'bg-rose-500/10 text-rose-700 border-rose-600/30';
      default:
        return 'bg-paperalt text-muted border-ink/25';
    }
  };

  return (
    <div
      onClick={() => onSelect(caseData.id)}
      className={`group relative flex flex-col justify-between p-5 border-2 transition-all duration-200 cursor-pointer ${
        isCompleted
          ? 'bg-paperalt border-accent hover:bg-ink hover:border-ink'
          : 'bg-paper border-ink hover:bg-ink hover:border-ink'
      }`}
    >
      {/* Top Header with Code & Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-muted group-hover:text-accent transition-colors">
              {caseData.code}
            </span>
            <span className="text-muted group-hover:text-paper/50 transition-colors">·</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-inksoft group-hover:text-paper/80 transition-colors">
              {getCategoryIcon(caseData.category)}
              {caseData.category.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${getDifficultyBadge(caseData.difficulty)}`}>
              {caseData.difficulty}
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-accent bg-accent/10 px-2 py-0.5 border border-accent/35">
                <CheckCircle2 className="w-3 h-3" /> Concluído
              </span>
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-base font-bold text-ink group-hover:text-paper leading-snug mb-1.5 transition-colors font-sans">
          {caseData.title}
        </h3>
        <p className="text-xs text-muted group-hover:text-paper/60 leading-relaxed line-clamp-2 mb-4 transition-colors">
          {caseData.subtitle}
        </p>

        {/* Business Scenario Context */}
        <div className="bg-paperalt group-hover:bg-ink/50 p-3 border border-ink/20 group-hover:border-paper/25 mb-4 font-mono text-[11px] space-y-1 transition-colors">
          <div className="flex justify-between text-muted group-hover:text-paper/50 transition-colors">
            <span>Empresa:</span>
            <span className="text-ink group-hover:text-paper font-semibold transition-colors">{caseData.companyContext.name}</span>
          </div>
          <div className="flex justify-between text-muted group-hover:text-paper/50 transition-colors">
            <span>Setor:</span>
            <span className="text-inksoft group-hover:text-paper/80 transition-colors">{caseData.companyContext.sector}</span>
          </div>
          <div className="flex justify-between text-muted group-hover:text-paper/50 transition-colors">
            <span>Fases de Decisão:</span>
            <span className="text-accent font-bold">{caseData.phases.length} etapas</span>
          </div>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-ink/20 group-hover:border-paper/25 flex items-center justify-between text-xs transition-colors">
        <div className="flex items-center gap-1 text-muted group-hover:text-paper/50 font-mono text-[11px] transition-colors">
          <Clock className="w-3 h-3" />
          <span>~{caseData.estimatedMinutes} min</span>
        </div>

        <button
          className="inline-flex items-center gap-1.5 font-mono text-xs text-accent group-hover:translate-x-0.5 transition-transform uppercase tracking-wider"
        >
          <span>{isCompleted ? 'Refazer' : 'Entrar no Case'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
