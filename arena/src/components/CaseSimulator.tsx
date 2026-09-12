import React, { useState } from 'react';
import type { AICase, ImpactMetrics, CaseOption } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Sparkles,
  RotateCcw,
  ExternalLink,
  Award,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CaseSimulatorProps {
  caseData: AICase;
  onBack: () => void;
  onComplete: (caseId: string, metrics: ImpactMetrics, decisions: Record<number, string>) => void;
  apiKey?: string;
}

export const CaseSimulator: React.FC<CaseSimulatorProps> = ({
  caseData,
  onBack,
  onComplete,
  apiKey,
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [currentMetrics, setCurrentMetrics] = useState<ImpactMetrics>(caseData.baselineMetrics);
  const [userReflections, setUserReflections] = useState<Record<number, string>>({});
  const [mentorFeedbacks, setMentorFeedbacks] = useState<Record<number, string>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isDebriefMode, setIsDebriefMode] = useState(false);

  const currentPhase = caseData.phases[currentPhaseIndex];
  const selectedOptionId = selectedOptions[currentPhaseIndex];
  const selectedOption = currentPhase?.options.find(o => o.id === selectedOptionId);

  const handleSelectOption = (option: CaseOption) => {
    if (selectedOptions[currentPhaseIndex]) return; // Já selecionado nesta fase

    setSelectedOptions(prev => ({
      ...prev,
      [currentPhaseIndex]: option.id
    }));

    // Recalcular métricas de impacto
    setCurrentMetrics(prev => ({
      qualityScore: Math.max(0, Math.min(100, prev.qualityScore + option.impactDeltas.quality)),
      costPerTask: Math.max(0.01, Number((prev.costPerTask + option.impactDeltas.cost).toFixed(2))),
      latencyMs: Math.max(200, prev.latencyMs + option.impactDeltas.latency),
      riskLevel: option.impactDeltas.risk,
      userTrust: Math.max(0, Math.min(100, prev.userTrust + option.impactDeltas.userTrust)),
    }));
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex < caseData.phases.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
    } else {
      setIsDebriefMode(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onComplete(caseData.id, currentMetrics, selectedOptions);
    }
  };

  const handleRestart = () => {
    setCurrentPhaseIndex(0);
    setSelectedOptions({});
    setCurrentMetrics(caseData.baselineMetrics);
    setUserReflections({});
    setMentorFeedbacks({});
    setIsDebriefMode(false);
  };

  // Avaliação com Mentor de IA
  const handleAskMentor = async () => {
    const reflection = userReflections[currentPhaseIndex];
    if (!reflection || reflection.trim().length < 10) return;

    setIsEvaluating(true);

    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Você é Rodrigo Tozato, editor do "Produto com IA" (www.produtocomia.com.br). Você é um Product Manager experiente em IA, rigoroso, focado em FinOps, Evals, governança e avesso a hype superficial.
Avalie a reflexão do aluno no seguinte cenário de produto com IA:
Case: ${caseData.title}
Fase: ${currentPhase.title}
Decisão Tomada: ${selectedOption?.title}
Reflexão escrita pelo aluno: "${reflection}"

Forneça um feedback técnico conciso em 3 parágrafos:
1. Ponto forte do raciocínio
2. Ponto cego ou risco que faltou considerar (focado em dados, custo ou governança)
3. Recomendação prática de ação para um AI-First PM.`
              }]
            }]
          })
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          setMentorFeedbacks(prev => ({ ...prev, [currentPhaseIndex]: reply }));
          setIsEvaluating(false);
          return;
        }
      } catch (err) {
        console.error("Erro ao conectar à API Gemini:", err);
      }
    }

    // Fallback inteligente offline calibrado
    setTimeout(() => {
      let smartFallback = "";
      if (selectedOption?.isRecommended) {
        smartFallback = `**Análise do Mentor Especialista:**\n\n` +
          `• **Ponto Forte:** Sua justificativa alinha-se aos princípios fundamentais do *Produto com IA*. Você compreendeu que em produtos com inteligência artificial, o trade-off entre custo, precisão e autonomia precisa ser governado com limites estruturados.\n\n` +
          `• **Ponto de Atenção:** Certifique-se de registrar a métrica de custo por tarefa e os SLOs de latência em um ledger acessível a toda a equipe, evitando que alterações futuras de modelo quebrem a sustentabilidade econômica.\n\n` +
          `• **Ação Prática:** Formalize um Golden Test Case específico para este cenário antes de autorizar o próximo release gate.`;
      } else {
        smartFallback = `**Análise do Mentor Especialista:**\n\n` +
          `• **Ponto de Atenção Crítico:** Cuidado com abordagens extremas (ou cortar custos cegamente ou delegar autonomia ilimitada). Na prática de AI Product Management, soluções determinísticas de proteção (circuit breakers, cache e fallbacks) devem sempre preceder medidas drásticas.\n\n` +
          `• **Recomendação:** Releia o guia oficial sobre ${caseData.category.toUpperCase()} do Produto com IA para aprofundar na distinção entre métricas de vaidade e unit economics reais.`;
      }

      setMentorFeedbacks(prev => ({ ...prev, [currentPhaseIndex]: smartFallback }));
      setIsEvaluating(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-ink/20">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Catálogo de Cases</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted">
            {caseData.code} · {caseData.companyContext.name}
          </span>
          <button
            onClick={handleRestart}
            title="Reiniciar simulação"
            className="p-1.5 rounded hover:bg-paperalt text-muted hover:text-ink transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Impact Metrics Dashboard */}
      <div className="bg-paper border-2 border-ink p-4 shadow-brutal">
        <div className="flex items-center justify-between mb-3 text-xs font-mono pb-3 border-b-2 border-ink">
          <span className="text-accent uppercase tracking-widest flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            [ Painel de Telemetria ]
          </span>
          <span className="text-[11px] text-muted uppercase tracking-wider">Atualizado a cada decisão</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center">

          {/* Quality Score */}
          <div className="bg-paper p-2.5 rounded border border-ink/20">
            <div className="text-[11px] text-muted mb-1">Acurácia / F1</div>
            <div className="text-lg font-bold text-ink flex items-center justify-center gap-1">
              {currentMetrics.qualityScore}%
              {currentMetrics.qualityScore > caseData.baselineMetrics.qualityScore && (
                <TrendingUp className="w-3.5 h-3.5 text-accent" />
              )}
              {currentMetrics.qualityScore < caseData.baselineMetrics.qualityScore && (
                <TrendingDown className="w-3.5 h-3.5 text-rose-700" />
              )}
            </div>
            <div className="w-full bg-paperalt h-1 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-accent h-full transition-all duration-500"
                style={{ width: `${currentMetrics.qualityScore}%` }}
              />
            </div>
          </div>

          {/* Cost per Task */}
          <div className="bg-paper p-2.5 rounded border border-ink/20">
            <div className="text-[11px] text-muted mb-1">Custo / Tarefa</div>
            <div className="text-lg font-bold text-ink flex items-center justify-center gap-1">
              ${currentMetrics.costPerTask.toFixed(2)}
              {currentMetrics.costPerTask < caseData.baselineMetrics.costPerTask && (
                <TrendingDown className="w-3.5 h-3.5 text-accent" />
              )}
              {currentMetrics.costPerTask > caseData.baselineMetrics.costPerTask && (
                <TrendingUp className="w-3.5 h-3.5 text-rose-700" />
              )}
            </div>
            <span className="text-[10px] text-muted">Base: ${caseData.baselineMetrics.costPerTask.toFixed(2)}</span>
          </div>

          {/* Latency p95 */}
          <div className="bg-paper p-2.5 rounded border border-ink/20">
            <div className="text-[11px] text-muted mb-1">Latência p95</div>
            <div className="text-lg font-bold text-ink flex items-center justify-center gap-1">
              {(currentMetrics.latencyMs / 1000).toFixed(1)}s
              {currentMetrics.latencyMs < caseData.baselineMetrics.latencyMs ? (
                <Zap className="w-3.5 h-3.5 text-accent" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-amber-700" />
              )}
            </div>
            <span className="text-[10px] text-muted">{currentMetrics.latencyMs}ms</span>
          </div>

          {/* Risk Level */}
          <div className="bg-paper p-2.5 rounded border border-ink/20">
            <div className="text-[11px] text-muted mb-1">Risco de IA</div>
            <div className="text-sm font-bold mt-1">
              <span className={`px-2 py-0.5 rounded text-[11px] uppercase ${
                currentMetrics.riskLevel === 'Baixo'
                  ? 'bg-accent/10 text-accent border border-accent/35'
                  : currentMetrics.riskLevel === 'Médio'
                  ? 'bg-amber-500/15 text-amber-700 border border-amber-600/35'
                  : 'bg-rose-500/10 text-rose-700 border border-rose-600/30'
              }`}>
                {currentMetrics.riskLevel}
              </span>
            </div>
          </div>

          {/* User Trust */}
          <div className="bg-paper p-2.5 rounded border border-ink/20 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-muted mb-1">Confiança / CSAT</div>
            <div className="text-lg font-bold text-ink">
              {currentMetrics.userTrust}%
            </div>
            <span className="text-[10px] text-muted">Satisfação líquida</span>
          </div>

        </div>
      </div>

      {/* Main Simulation View or Final Debrief View */}
      {!isDebriefMode ? (
        <div className="space-y-6">

          {/* Phase Stepper Header */}
          <div className="bg-paperalt p-4  border border-ink/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded border border-accent/25">
                  Fase {currentPhase.phaseNumber} de {caseData.phases.length}
                </span>
                <h2 className="text-base font-bold text-ink font-sans">
                  {currentPhase.title}
                </h2>
              </div>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center space-x-2 mb-4">
              {caseData.phases.map((phase, idx) => (
                <div
                  key={phase.id}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    idx < currentPhaseIndex
                      ? 'bg-accent'
                      : idx === currentPhaseIndex
                      ? 'bg-accent animate-pulse'
                      : 'bg-paperalt'
                  }`}
                />
              ))}
            </div>

            {/* Scenario Narrative */}
            <p className="text-sm text-ink leading-relaxed mb-4">
              {currentPhase.scenario}
            </p>

            {/* Context Data Pills if any */}
            {currentPhase.contextData && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-ink/20 font-mono text-xs">
                {currentPhase.contextData.map((item, idx) => (
                  <div key={idx} className="bg-paper p-2.5 rounded border border-ink/20">
                    <div className="text-[10px] text-muted uppercase">{item.label}</div>
                    <div className="text-ink font-bold mt-0.5">{item.value}</div>
                    {item.subtext && <div className="text-[10px] text-muted mt-0.5">{item.subtext}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Options Decision Arena */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-1.5">
              <span>Selecione a sua decisão de Product Manager:</span>
            </h3>

            <div className="grid grid-cols-1 gap-3.5">
              {currentPhase.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const hasDecision = !!selectedOptionId;

                return (
                  <div
                    key={option.id}
                    onClick={() => !hasDecision && handleSelectOption(option)}
                    className={`p-4  border transition-all ${
                      isSelected
                        ? option.isRecommended
                          ? 'bg-accent/10 border-accent/75 ring-1 ring-accent/45'
                          : 'bg-rose-500/10 border-rose-600/70 ring-1 ring-rose-600/40'
                        : hasDecision
                        ? 'opacity-60 bg-paperalt border-ink/20 cursor-not-allowed'
                        : 'bg-paperalt border-ink/20 hover:border-ink/35 hover:bg-paperalt cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-ink font-sans">
                            {option.title}
                          </h4>
                          {isSelected && (
                            <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                              option.isRecommended
                                ? 'bg-accent/15 text-accent border-accent/45'
                                : 'bg-rose-500/20 text-rose-700 border-rose-600/40'
                            }`}>
                              {option.isRecommended ? 'Decisão Recomendada' : 'Trade-off Problemático'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-inksoft leading-relaxed">
                          {option.description}
                        </p>
                      </div>

                      {!hasDecision && (
                        <button className="text-xs font-mono text-muted hover:text-accent whitespace-nowrap px-3 py-1.5 rounded bg-paperalt hover:bg-linesoft transition-colors">
                          Decidir →
                        </button>
                      )}
                    </div>

                    {/* Impact preview pill if selected */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-ink/20 flex flex-wrap items-center gap-3 text-[11px] font-mono">
                        <span className="text-muted">Impacto Previsto:</span>
                        <span className={option.impactDeltas.quality >= 0 ? 'text-accent' : 'text-rose-700'}>
                          Qualidade: {option.impactDeltas.quality >= 0 ? `+${option.impactDeltas.quality}%` : `${option.impactDeltas.quality}%`}
                        </span>
                        <span className={option.impactDeltas.cost <= 0 ? 'text-accent' : 'text-rose-700'}>
                          Custo: {option.impactDeltas.cost <= 0 ? `${option.impactDeltas.cost.toFixed(2)}$` : `+${option.impactDeltas.cost.toFixed(2)}$`}
                        </span>
                        <span className={option.impactDeltas.latency <= 0 ? 'text-accent' : 'text-amber-700'}>
                          Latência: {option.impactDeltas.latency <= 0 ? `${option.impactDeltas.latency}ms` : `+${option.impactDeltas.latency}ms`}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback & Analysis Section (Only visible after decision) */}
          {selectedOption && (
            <div className="space-y-4 animate-fadeIn">

              <div className={`p-4  border ${
                selectedOption.isRecommended
                  ? 'bg-accent/10 border-accent/45'
                  : 'bg-amber-500/15 border-amber-600/45'
              }`}>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold">
                  {selectedOption.isRecommended ? (
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                  )}
                  <span className={selectedOption.isRecommended ? 'text-accent' : 'text-amber-700'}>
                    {selectedOption.feedback.title}
                  </span>
                </div>

                <p className="text-xs text-ink leading-relaxed mb-3">
                  {selectedOption.feedback.analysis}
                </p>

                <div className="bg-paper/60 p-3 rounded border border-ink/20 text-xs font-mono">
                  <span className="text-accent font-bold uppercase block mb-1">
                    Lição Prática para o AI-First PM:
                  </span>
                  <p className="text-inksoft">
                    {selectedOption.feedback.practicalLesson}
                  </p>
                </div>

                {selectedOption.feedback.referenceGuideSlug && (
                  <div className="mt-3 pt-2 border-t border-ink/20 flex items-center justify-between text-xs font-mono">
                    <span className="text-muted">Referência Oficial:</span>
                    <a
                      href={`https://www.produtocomia.com.br/guias/${selectedOption.feedback.referenceGuideSlug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent flex items-center gap-1 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Ler Guia Completo no Produto com IA <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Reflection & AI Mentor Evaluation */}
              <div className="bg-paperalt p-4  border border-ink/20 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-inksoft font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    Reflexão Crítica do PM (Opcional):
                  </label>
                  <span className="text-[10px] text-muted">
                    Como você defenderia esta decisão para a liderança técnica?
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={userReflections[currentPhaseIndex] || ''}
                  onChange={(e) => setUserReflections({ ...userReflections, [currentPhaseIndex]: e.target.value })}
                  placeholder="Escreva sua justificativa executiva ou arquitetural aqui (ex: 'Priorizei cache semântico e roteador leve porque 68% do volume é trivial...')..."
                  className="w-full bg-paper border border-ink/20 rounded p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-accent/55"
                />

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleAskMentor}
                    disabled={isEvaluating || !userReflections[currentPhaseIndex] || userReflections[currentPhaseIndex]?.trim().length < 8}
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded bg-accent/10 hover:bg-accentdark/15 text-accent border border-accent/35 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-3 h-3" />
                    {isEvaluating ? 'Avaliando com Mentor...' : 'Avaliar Justificativa com Mentor de IA'}
                  </button>

                  <button
                    onClick={handleNextPhase}
                    className="inline-flex items-center gap-2 text-xs font-mono px-4 py-2 rounded bg-accent hover:bg-accentdark text-paper font-bold transition-all  shadow-accent/25"
                  >
                    <span>
                      {currentPhaseIndex < caseData.phases.length - 1 ? 'Avançar para Próxima Fase' : 'Concluir & Ver Debrief Final'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {mentorFeedbacks[currentPhaseIndex] && (
                  <div className="mt-3 p-3.5 rounded bg-paper border border-accent/35 text-xs text-inksoft space-y-2 whitespace-pre-line leading-relaxed">
                    <div className="text-accent font-bold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" /> Parecer do Mentor Especialista:
                    </div>
                    {mentorFeedbacks[currentPhaseIndex]}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      ) : (
        /* Final Technical Debrief Screen */
        <div className="bg-paperalt p-6  border border-ink/20 space-y-6 animate-fadeIn">

          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 border border-accent/35 text-accent mb-1">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-ink font-sans">
              Case Concluído com Sucesso!
            </h2>
            <p className="text-xs text-muted">
              Você completou todas as fases de decisão para <strong className="text-ink">{caseData.title}</strong>.
            </p>
          </div>

          {/* Metrics Scorecard Comparison */}
          <div className="bg-paper p-4  border border-ink/20">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted mb-3 font-semibold">
              Comparativo de Impacto (Antes vs Depois da sua Gestão)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center text-xs">
              <div className="p-2.5 rounded bg-paperalt border border-ink/20">
                <span className="text-muted block text-[10px]">Acurácia Final</span>
                <span className="text-base font-bold text-accent">{currentMetrics.qualityScore}%</span>
                <span className="text-[10px] text-muted block mt-0.5">Base: {caseData.baselineMetrics.qualityScore}%</span>
              </div>
              <div className="p-2.5 rounded bg-paperalt border border-ink/20">
                <span className="text-muted block text-[10px]">Custo por Tarefa</span>
                <span className="text-base font-bold text-accent">${currentMetrics.costPerTask.toFixed(2)}</span>
                <span className="text-[10px] text-muted block mt-0.5">Base: ${caseData.baselineMetrics.costPerTask.toFixed(2)}</span>
              </div>
              <div className="p-2.5 rounded bg-paperalt border border-ink/20">
                <span className="text-muted block text-[10px]">Latência p95</span>
                <span className="text-base font-bold text-accent">{(currentMetrics.latencyMs / 1000).toFixed(1)}s</span>
                <span className="text-[10px] text-muted block mt-0.5">Base: {(caseData.baselineMetrics.latencyMs / 1000).toFixed(1)}s</span>
              </div>
              <div className="p-2.5 rounded bg-paperalt border border-ink/20">
                <span className="text-muted block text-[10px]">Risco Residual</span>
                <span className="text-base font-bold text-accent">{currentMetrics.riskLevel}</span>
                <span className="text-[10px] text-muted block mt-0.5">Base: {caseData.baselineMetrics.riskLevel}</span>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              Principais Lições Aprendidas deste Case
            </h3>
            <div className="space-y-2">
              {caseData.technicalDebrief.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded bg-paper border border-ink/20 text-xs text-inksoft">
                  <span className="font-mono text-accent font-bold">0{idx + 1}.</span>
                  <span className="leading-relaxed">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deepen with Official Guides */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-accent" />
              Aprofundar nos Guias Oficiais do Produto com IA
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseData.technicalDebrief.officialGuides.map((guide, idx) => (
                <a
                  key={idx}
                  href={guide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded bg-paper border border-ink/20 hover:border-accent/55 group transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-ink group-hover:text-accent transition-colors">
                      {guide.title}
                    </span>
                    <ExternalLink className="w-3 h-3 text-muted group-hover:text-accent" />
                  </div>
                  <p className="text-[11px] text-muted line-clamp-2">
                    {guide.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-ink/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-4 py-2 rounded bg-paperalt hover:bg-linesoft text-xs font-mono text-inksoft transition-colors"
            >
              Refazer Este Case
            </button>
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-2.5 rounded bg-accent hover:bg-accentdark text-paper text-xs font-mono font-bold transition-all  shadow-accent/25"
            >
              Concluir e Ir para o Catálogo de Cases →
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
