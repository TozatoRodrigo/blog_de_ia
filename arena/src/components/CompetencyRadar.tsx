import React, { useState } from 'react';
import { COMPETENCY_DIMENSIONS } from '../data/competencies';
import { ShieldCheck, RotateCcw, ArrowRight, BookOpen } from 'lucide-react';

interface CompetencyRadarProps {
  onStartCaseByTopic: (topic: string) => void;
  onOpenGuides: () => void;
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({
  onStartCaseByTopic,
  onOpenGuides,
}) => {
  // Estado das respostas
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Calcular notas por dimensão
  const calculateScores = () => {
    const scores: Record<string, number> = {};
    COMPETENCY_DIMENSIONS.forEach(dim => {
      let dimTotal = 0;
      let questionCount = 0;
      dim.questions.forEach(q => {
        if (answers[q.id]) {
          dimTotal += answers[q.id];
          questionCount++;
        }
      });
      // Converter para escala de 0 a 100
      scores[dim.id] = questionCount > 0 ? Math.round((dimTotal / (questionCount * 5)) * 100) : 40;
    });
    return scores;
  };

  const scores = calculateScores();
  const totalQuestions = COMPETENCY_DIMENSIONS.reduce((acc, d) => acc + d.questions.length, 0);
  const answeredCount = Object.keys(answers).length;

  const handleSelectAnswer = (qId: string, points: number) => {
    setAnswers(prev => {
      const updated = { ...prev, [qId]: points };
      if (Object.keys(updated).length === totalQuestions) {
        setIsCompleted(true);
      }
      return updated;
    });
  };

  const handleReset = () => {
    setAnswers({});
    setIsCompleted(false);
  };

  // Gerador de polígono SVG para o Radar
  const renderRadarChart = () => {
    const size = 320;
    const center = size / 2;
    const radius = 105;
    const totalSides = COMPETENCY_DIMENSIONS.length;

    // Calcular pontos do polígono do usuário
    const points = COMPETENCY_DIMENSIONS.map((dim, i) => {
      const score = scores[dim.id] || 40;
      const r = (score / 100) * radius;
      const angle = (Math.PI * 2 / totalSides) * i - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={size} height={size} className="mx-auto overflow-visible">
        {/* Círculos concêntricos de fundo */}
        {[0.25, 0.5, 0.75, 1].map((level, idx) => (
          <circle
            key={idx}
            cx={center}
            cy={center}
            r={radius * level}
            fill="none"
            stroke="#1e293b"
            strokeDasharray={level < 1 ? "3 3" : undefined}
            strokeWidth="1"
          />
        ))}

        {/* Eixos */}
        {COMPETENCY_DIMENSIONS.map((_, i) => {
          const angle = (Math.PI * 2 / totalSides) * i - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#334155"
              strokeWidth="1"
            />
          );
        })}

        {/* Polígono do Usuário */}
        <polygon
          points={points}
          fill="rgba(16, 185, 129, 0.25)"
          stroke="#10b981"
          strokeWidth="2"
          className="transition-all duration-500 ease-out"
        />

        {/* Pontos nos vértices */}
        {COMPETENCY_DIMENSIONS.map((dim, i) => {
          const score = scores[dim.id] || 40;
          const r = (score / 100) * radius;
          const angle = (Math.PI * 2 / totalSides) * i - Math.PI / 2;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              className="fill-accent stroke-[#0b0f17] stroke-2"
            />
          );
        })}

        {/* Rótulos das dimensões */}
        {COMPETENCY_DIMENSIONS.map((dim, i) => {
          const angle = (Math.PI * 2 / totalSides) * i - Math.PI / 2;
          const labelRadius = radius + 28;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          const score = scores[dim.id] || 0;
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] font-mono fill-muted font-semibold"
            >
              {dim.title.split(' ')[0]} ({score}%)
            </text>
          );
        })}
      </svg>
    );
  };

  // Média Geral
  const overallAverage = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / COMPETENCY_DIMENSIONS.length
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/25 font-semibold">
          AUTOAVALIAÇÃO DE HABILIDADES
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink font-sans">
          Radar de Competências do <span className="text-accent">AI-First PM</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Descubra seus pontos fortes e seus pontos cegos no novo paradigma de produto. Responda às perguntas diagnósticas para mapear seu perfil em 6 dimensões vitais.
        </p>
      </div>

      {/* Main Grid: Radar Chart + Diagnostic Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Col 1: Radar Chart Display */}
        <div className="bg-paperalt p-6  border border-ink/20 flex flex-col items-center justify-between text-center space-y-4">
          <div className="w-full flex items-center justify-between font-mono text-xs text-muted">
            <span>Diagnóstico Visual</span>
            <span className="text-accent font-bold">{answeredCount}/{totalQuestions} Respondidas</span>
          </div>

          <div className="py-2">
            {renderRadarChart()}
          </div>

          <div className="w-full pt-4 border-t border-ink/20 font-mono text-xs space-y-2">
            <div className="flex justify-between items-center text-inksoft">
              <span>Índice Geral de Prontidão AI-First:</span>
              <span className="text-accent font-bold text-base">{overallAverage}%</span>
            </div>
            <div className="w-full bg-paperalt h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-accent h-full transition-all duration-500"
                style={{ width: `${overallAverage}%` }}
              />
            </div>
            <button
              onClick={handleReset}
              className="mt-2 text-[11px] text-muted hover:text-inksoft inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reiniciar Diagnóstico
            </button>
          </div>
        </div>

        {/* Col 2 & 3: Diagnostic Questions or Results */}
        <div className="lg:col-span-2 space-y-6">

          {/* Progress / Status banner */}
          <div className="bg-paper p-4  border border-ink/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="text-ink font-semibold">
                {isCompleted ? 'Diagnóstico Completo!' : 'Responda as questões abaixo para calibrar o gráfico:'}
              </span>
            </div>
            {isCompleted && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartCaseByTopic('finops')}
                  className="px-2.5 py-1 rounded bg-accent text-paper font-bold text-[11px] hover:bg-accentdark transition-colors flex items-center gap-1"
                >
                  <span>Praticar Cases</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={onOpenGuides}
                  className="px-2.5 py-1 rounded bg-paperalt text-ink text-[11px] hover:bg-linesoft transition-colors flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3 text-accent" />
                  <span>Ver Guias</span>
                </button>
              </div>
            )}
          </div>

          {/* Questions Accordion / List */}
          <div className="space-y-4">
            {COMPETENCY_DIMENSIONS.map((dim) => (
              <div key={dim.id} className="bg-paperalt p-4  border border-ink/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-ink font-mono uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {dim.title}
                  </h3>
                  <span className="text-xs font-mono text-accent font-bold">
                    {scores[dim.id]}%
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  {dim.description}
                </p>

                <div className="space-y-3 pt-2">
                  {dim.questions.map((q) => (
                    <div key={q.id} className="space-y-2 bg-paper p-3 rounded border border-ink/20">
                      <div className="text-xs text-ink font-medium">
                        {q.question}
                      </div>
                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = answers[q.id] === opt.points;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectAnswer(q.id, opt.points)}
                              className={`w-full text-left p-2.5 rounded text-xs transition-all flex items-start gap-2.5 ${
                                isSelected
                                  ? 'bg-accent/10 border border-accent/65 text-ink font-medium'
                                  : 'bg-paperalt border border-ink/20 text-muted hover:text-ink hover:bg-paperalt'
                              }`}
                            >
                              <span className={`w-3.5 h-3.5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center text-[9px] ${
                                isSelected ? 'border-accent bg-accent text-paper font-bold' : 'border-ink/35'
                              }`}>
                                {isSelected ? '✓' : ''}
                              </span>
                              <span className="leading-relaxed">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
