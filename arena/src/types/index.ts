export type TopicCategory =
  | 'agentes'
  | 'finops'
  | 'evals'
  | 'governanca'
  | 'discovery'
  | 'sdd';

export type DifficultyLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export type CareerOrigin =
  | 'pm_tradicional'
  | 'engenharia'
  | 'dados'
  | 'operacoes_negocios';

export interface ImpactMetrics {
  qualityScore: number; // 0 a 100 (Acurácia / F1 / Resolução)
  costPerTask: number; // em USD (ex: $0.04)
  latencyMs: number; // latência p95 em ms (ex: 1200ms)
  riskLevel: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  userTrust: number; // 0 a 100
}

export interface CaseOption {
  id: string;
  title: string;
  description: string;
  rationale: string;
  isRecommended: boolean;
  impactDeltas: {
    quality: number;
    cost: number; // variação em USD
    latency: number; // variação em ms
    risk: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
    userTrust: number;
  };
  feedback: {
    title: string;
    analysis: string;
    practicalLesson: string;
    referenceGuideSlug?: string;
  };
}

export interface CasePhase {
  id: string;
  phaseNumber: number;
  title: string;
  scenario: string;
  contextData?: {
    label: string;
    value: string;
    subtext?: string;
  }[];
  options: CaseOption[];
  reflectionPrompt?: string;
}

export interface AICase {
  id: string;
  code: string; // Ex: "CASE.01"
  title: string;
  subtitle: string;
  companyContext: {
    name: string;
    sector: string;
    scale: string;
    challenge: string;
  };
  category: TopicCategory;
  difficulty: DifficultyLevel;
  targetOrigins: CareerOrigin[];
  estimatedMinutes: number;
  baselineMetrics: ImpactMetrics;
  phases: CasePhase[];
  technicalDebrief: {
    summary: string;
    keyTakeaways: string[];
    officialGuides: {
      title: string;
      url: string;
      description: string;
    }[];
    specTemplateId?: string;
  };
}

export interface CareerTrack {
  id: CareerOrigin;
  title: string;
  badge: string;
  tagline: string;
  fromRole: string;
  keyMindsetShift: string;
  blindSpots: string[];
  recommendedCases: string[]; // IDs dos cases
  actionPlan: {
    step: string;
    action: string;
    outcome: string;
  }[];
}

export interface CompetencyDimension {
  id: string;
  title: string;
  description: string;
  weight: number;
  questions: {
    id: string;
    question: string;
    options: {
      text: string;
      points: number; // 1 a 5
    }[];
  }[];
}

export interface UserProgress {
  completedCases: {
    caseId: string;
    completedAt: string;
    score: number;
    metrics: ImpactMetrics;
    decisions: Record<number, string>; // phaseIndex -> optionId
  }[];
  activeCaseId: string | null;
  activePhaseIndex: number;
  competencyScores: Record<string, number>;
  careerOrigin: CareerOrigin | null;
}
