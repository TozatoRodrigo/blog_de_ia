import React, { useState } from 'react';
import { CAREER_TRACKS } from '../data/tracks';
import { AI_CASES } from '../data/cases';
import type { CareerOrigin } from '../types';
import { Compass, AlertTriangle, ArrowRight, BookOpen, Sparkles, UserCheck } from 'lucide-react';

interface CareerTracksProps {
  onStartCase: (caseId: string) => void;
  selectedOrigin: CareerOrigin | null;
  onSelectOrigin: (origin: CareerOrigin) => void;
}

export const CareerTracks: React.FC<CareerTracksProps> = ({
  onStartCase,
  selectedOrigin,
  onSelectOrigin,
}) => {
  const [activeTrackId, setActiveTrackId] = useState<CareerOrigin>(
    selectedOrigin || 'pm_tradicional'
  );

  const activeTrack = CAREER_TRACKS.find(t => t.id === activeTrackId) || CAREER_TRACKS[0];

  const recommendedCaseObjects = AI_CASES.filter(c =>
    activeTrack.recommendedCases.includes(c.id)
  );

  const handleTrackChange = (id: CareerOrigin) => {
    setActiveTrackId(id);
    onSelectOrigin(id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/25 font-semibold">
          TRANSIÇÃO DE CARREIRA PARA AI PRODUCT MANAGEMENT
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink font-sans">
          Não se torne um PM comum. Seja um <span className="text-accent">AI-First PM</span>.
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Gerenciar inteligência artificial exige um conjunto de habilidades completamente diferente do software tradicional. Escolha sua origem e veja exatamente o que você precisa desaprender e aprender.
        </p>
      </div>

      {/* Origin Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CAREER_TRACKS.map((track) => {
          const isSelected = activeTrackId === track.id;
          return (
            <button
              key={track.id}
              onClick={() => handleTrackChange(track.id)}
              className={`p-4  border text-left transition-all ${
                isSelected
                  ? 'bg-paperalt border-accent ring-1 ring-accent/45  shadow-ink/15'
                  : 'bg-paperalt border-ink/20 hover:border-ink/25 hover:bg-paperalt'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                  isSelected
                    ? 'bg-accent/15 text-accent border-accent/35'
                    : 'bg-paperalt text-muted border-ink/25'
                }`}>
                  {track.badge}
                </span>
                {isSelected && <UserCheck className="w-4 h-4 text-accent" />}
              </div>
              <h3 className="text-sm font-bold text-ink font-sans leading-snug">
                {track.title}
              </h3>
              <p className="text-[11px] text-muted mt-1 line-clamp-2">
                {track.fromRole}
              </p>
            </button>
          );
        })}
      </div>

      {/* Track In-Depth Breakdown */}
      <div className="bg-paperalt  border border-ink/20 p-6 space-y-6">

        {/* Mindset Shift Hero */}
        <div className="bg-paper p-5  border border-ink/20 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-accent font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-accent" />
            A Mudança Fundamental de Mindset (Shift Paradigm)
          </div>
          <p className="text-sm text-ink leading-relaxed">
            {activeTrack.keyMindsetShift}
          </p>
        </div>

        {/* 2 Columns: Blind Spots & Action Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Col 1: Blind Spots to Avoid */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-rose-700 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              Pontos Cegos & Armadilhas Mais Comuns deste Perfil
            </h3>
            <div className="space-y-2.5">
              {activeTrack.blindSpots.map((spot, idx) => (
                <div key={idx} className="p-3 rounded bg-paper border border-rose-600/30 text-xs text-inksoft flex items-start gap-2.5">
                  <span className="font-mono text-rose-700 font-bold shrink-0">!</span>
                  <span className="leading-relaxed">{spot}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Structured 3-Step Action Plan */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-bold flex items-center gap-2">
              <Compass className="w-4 h-4 text-accent" />
              Plano de Ação Estruturado de Transição
            </h3>
            <div className="space-y-2.5">
              {activeTrack.actionPlan.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded bg-paper border border-ink/20 space-y-1.5 text-xs">
                  <div className="font-mono text-accent font-bold">
                    {item.step}
                  </div>
                  <p className="text-inksoft">
                    <strong className="text-ink">Ação:</strong> {item.action}
                  </p>
                  <p className="text-muted text-[11px]">
                    <strong className="text-inksoft font-mono">Resultado Esperado:</strong> {item.outcome}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recommended Cases for this Profile */}
        <div className="pt-4 border-t border-ink/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-inksoft font-bold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              Cases Práticos Recomendados para Iniciar a Transição
            </h3>
            <span className="text-[11px] font-mono text-muted">
              Prática imediata recomendada
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {recommendedCaseObjects.map((c) => (
              <div
                key={c.id}
                onClick={() => onStartCase(c.id)}
                className="p-4  bg-paper border border-ink/20 hover:border-accent/55 hover:bg-paperalt transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                    <span className="text-accent font-bold">{c.code}</span>
                    <span className="text-muted uppercase">{c.difficulty}</span>
                  </div>
                  <h4 className="text-xs font-bold text-ink group-hover:text-ink transition-colors mb-1">
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-muted line-clamp-2 mb-3">
                    {c.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-ink/20 flex items-center justify-between text-[11px] font-mono text-accent">
                  <span>Praticar Case</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
