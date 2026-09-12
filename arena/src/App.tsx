import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CaseCard } from './components/CaseCard';
import { CaseSimulator } from './components/CaseSimulator';
import { CareerTracks } from './components/CareerTracks';
import { CompetencyRadar } from './components/CompetencyRadar';
import { GuidesHub } from './components/GuidesHub';
import { TemplatesViewer } from './components/TemplatesViewer';
import { ToolchainHub } from './components/ToolchainHub';
import { SddHub } from './components/SddHub';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AI_CASES } from './data/cases';
import type { CareerOrigin, ImpactMetrics } from './types';
import {
  Compass,
  Filter,
  ArrowRight,
  Workflow,
  GitMerge
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [userOrigin, setUserOrigin] = useState<CareerOrigin | null>(() => {
    return (localStorage.getItem('ai_pm_origin') as CareerOrigin) || null;
  });

  const [completedCases, setCompletedCases] = useState<Record<string, { metrics: ImpactMetrics; completedAt: string }>>(() => {
    try {
      const saved = localStorage.getItem('ai_pm_completed_cases');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_pm_completed_cases', JSON.stringify(completedCases));
    } catch (e) {
      console.error(e);
    }
  }, [completedCases]);

  const handleSaveOrigin = (origin: CareerOrigin) => {
    setUserOrigin(origin);
    localStorage.setItem('ai_pm_origin', origin);
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleCompleteCase = (caseId: string, metrics: ImpactMetrics) => {
    setCompletedCases(prev => ({
      ...prev,
      [caseId]: {
        metrics,
        completedAt: new Date().toISOString()
      }
    }));
  };

  const handleStartCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('cases');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCase = AI_CASES.find(c => c.id === selectedCaseId);

  // Filtragem de cases
  const filteredCases = AI_CASES.filter(c => {
    if (categoryFilter !== 'todos' && c.category !== categoryFilter) return false;
    return true;
  });

  const completedCount = Object.keys(completedCases).length;

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans selection:bg-accent/20 selection:text-accentdark">

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'cases') setSelectedCaseId(null);
        }}
        completedCasesCount={completedCount}
        totalCasesCount={AI_CASES.length}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasCustomKey={!!apiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* VIEW: CASES CATALOG / SIMULATOR */}
        {activeTab === 'cases' && (
          <div>
            {activeCase ? (
              <CaseSimulator
                caseData={activeCase}
                onBack={() => setSelectedCaseId(null)}
                onComplete={handleCompleteCase}
                apiKey={apiKey}
              />
            ) : (
              <div className="space-y-8 animate-fadeIn pb-12">

                {/* Hero Banner — estilo oficial Produto com IA */}
                <div className="relative border-2 border-ink bg-paper p-6 sm:p-10 overflow-hidden shadow-brutal-accent">
                  <span className="crosshair crosshair--tl" />
                  <span className="crosshair crosshair--tr" />
                  <span className="crosshair crosshair--bl" />
                  <span className="crosshair crosshair--br" />

                  <div className="max-w-3xl space-y-5 relative z-[2]">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono uppercase tracking-widest text-accent border border-accent px-3 py-1 text-xs font-bold inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent inline-block rounded-full animate-pulse" />
                        Arena de Simulação — AI-First
                      </span>
                      <span className="text-muted text-xs font-mono uppercase tracking-wider">
                        Baseado na metodologia de <a href="https://www.produtocomia.com.br" target="_blank" rel="noopener noreferrer" className="text-accent border-b border-accent hover:bg-accent hover:text-paper transition-colors">produtocomia.com.br</a>
                      </span>
                    </div>

                    <h2 className="font-display text-3xl sm:text-5xl uppercase leading-[0.95] text-ink max-w-2xl">
                      Pratique a gestão de produto orientada a IA em <span className="text-accent">cenários reais</span>.
                    </h2>

                    <p className="text-sm sm:text-base text-inksoft leading-relaxed max-w-2xl">
                      Para quem quer liderar o futuro do software: enfrente crises de FinOps, alucinações silenciosas de crédito, desastres de agentes autônomos e a transição do Jira para o Spec-Driven Development.
                    </p>

                    {/* Fast Track Selector CTA — botões estilo oficial */}
                    <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider">
                      <button
                        onClick={() => setActiveTab('sdd')}
                        className="inline-flex items-center gap-2 px-4 py-3 bg-accent text-paper border-2 border-accent font-bold hover:bg-ink hover:border-ink transition-colors"
                      >
                        <GitMerge className="w-3.5 h-3.5" />
                        <span>Masterclass: SDD</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setActiveTab('stack')}
                        className="inline-flex items-center gap-2 px-4 py-3 bg-paper text-ink border-2 border-ink font-bold hover:bg-ink hover:text-paper transition-colors"
                      >
                        <Workflow className="w-3.5 h-3.5" />
                        <span>Stack &amp; OS</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('trilhas')}
                        className="inline-flex items-center gap-2 px-4 py-3 bg-paper text-ink border-2 border-ink font-bold hover:bg-ink hover:text-paper transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Trilhas de Transição</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress Stats — estilo hero__meta oficial */}
                  <div className="mt-8 pt-6 border-t-2 border-ink grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono uppercase tracking-wider text-xs">
                    <div>
                      <span className="text-muted block text-[10px]">Cases Disponíveis</span>
                      <span className="block font-display text-2xl text-ink normal-case mt-1">{AI_CASES.length}</span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">Seu Progresso</span>
                      <span className="block font-display text-2xl text-accent normal-case mt-1">{completedCount}/{AI_CASES.length}</span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">Metodologia Oficial</span>
                      <span className="block font-display text-2xl text-ink normal-case mt-1">Spec Kit</span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">Foco Operacional</span>
                      <span className="block font-display text-2xl text-ink normal-case mt-1">Dado Real</span>
                    </div>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto no-scrollbar font-mono text-xs">
                    <span className="text-muted text-[11px] uppercase mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3" /> Tópico:
                    </span>
                    {[
                      { id: 'todos', label: 'Todos' },
                      { id: 'finops', label: 'FinOps' },
                      { id: 'evals', label: 'Evals & Qualidade' },
                      { id: 'governanca', label: 'Governança' },
                      { id: 'sdd', label: 'Spec Kit / SDD' },
                      { id: 'discovery', label: 'Discovery Anti-Hype' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setCategoryFilter(f.id)}
                        className={`px-3 py-1 rounded whitespace-nowrap transition-all ${
                          categoryFilter === f.id
                            ? 'bg-paperalt text-accent border border-ink/25 font-bold'
                            : 'text-muted hover:text-ink hover:bg-paperalt'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-mono text-muted">
                    Mostrando {filteredCases.length} {filteredCases.length === 1 ? 'case' : 'cases'}
                  </span>
                </div>

                {/* Cases Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCases.map(caseItem => (
                    <CaseCard
                      key={caseItem.id}
                      caseData={caseItem}
                      isCompleted={!!completedCases[caseItem.id]}
                      onSelect={handleStartCase}
                    />
                  ))}
                </div>

              </div>
            )}
          </div>
        )}

        {/* VIEW: SPEC-DRIVEN DEVELOPMENT (SDD) */}
        {activeTab === 'sdd' && (
          <SddHub />
        )}

        {/* VIEW: STACK & OS DO AI PM */}
        {activeTab === 'stack' && (
          <ToolchainHub />
        )}

        {/* VIEW: CAREER TRANSITION TRACKS */}
        {activeTab === 'trilhas' && (
          <CareerTracks
            onStartCase={handleStartCase}
            selectedOrigin={userOrigin}
            onSelectOrigin={handleSaveOrigin}
          />
        )}

        {/* VIEW: COMPETENCY RADAR */}
        {activeTab === 'radar' && (
          <CompetencyRadar
            onStartCaseByTopic={(topic) => {
              setCategoryFilter(topic);
              setActiveTab('cases');
            }}
            onOpenGuides={() => setActiveTab('guias')}
          />
        )}

        {/* VIEW: PRACTICAL TEMPLATES */}
        {activeTab === 'templates' && (
          <TemplatesViewer />
        )}

        {/* VIEW: OFFICIAL GUIDES HUB */}
        {activeTab === 'guias' && (
          <GuidesHub />
        )}

      </main>

      {/* Footer with Editorial Credits */}
      <Footer />

      {/* Optional Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />

    </div>
  );
}

export default App;
