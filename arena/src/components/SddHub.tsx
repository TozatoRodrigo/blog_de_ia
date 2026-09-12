import React, { useState } from 'react';
import { SDD_PHASES, SDD_ROLES, SDD_SAMPLE_SPEC } from '../data/sdd';
import {
  GitMerge,
  FileText,
  CheckCircle2,
  Users,
  Copy,
  Check,
  Terminal,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export const SddHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'fluxo' | 'papeis' | 'anatomia' | 'setup'>('fluxo');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('specify');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeArtifactTab, setActiveArtifactTab] = useState<'spec' | 'plan' | 'tasks'>('spec');
  const [isShortPath, setIsShortPath] = useState(false);

  const displayedPhases = isShortPath
    ? SDD_PHASES.filter(p => ['specify', 'plan', 'tasks', 'implement', 'converge'].includes(p.id))
    : SDD_PHASES;

  const currentPhase = SDD_PHASES.find(p => p.id === selectedPhaseId) || displayedPhases[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getOwnerBadge = (owner: string) => {
    switch (owner) {
      case 'PM':
        return 'bg-blue-600/10 text-blue-700 border-blue-600/30';
      case 'Tech Lead':
        return 'bg-purple-600/10 text-purple-700 border-purple-600/30';
      case 'Coding Agent':
        return 'bg-accent/10 text-accent border-accent/35';
      case 'Ambos':
      default:
        return 'bg-amber-500/15 text-amber-700 border-amber-600/35';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/25 font-semibold">
          METODOLOGIA DE ENGENHARIA DE PRODUTO
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink font-sans">
          Spec-Driven Development <span className="text-accent">(SDD)</span> na Prática
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          O novo fluxo de trabalho entre <strong>Product Manager</strong>, <strong>Tech Lead</strong> e <strong>Coding Agents</strong> (Antigravity, Claude Code, Cursor). Da ideia à verificação matemática de requisitos com o GitHub Spec Kit.
        </p>
      </div>

      {/* Navigation SubTabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 border-b border-ink/20 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('fluxo')}
          className={`px-3.5 py-1.5  transition-all flex items-center gap-1.5 ${
            activeSubTab === 'fluxo'
              ? 'bg-paperalt text-accent border border-ink/25 font-bold'
              : 'text-muted hover:text-ink'
          }`}
        >
          <GitMerge className="w-3.5 h-3.5" />
          <span>O Ciclo de Fases</span>
        </button>

        <button
          onClick={() => setActiveSubTab('papeis')}
          className={`px-3.5 py-1.5  transition-all flex items-center gap-1.5 ${
            activeSubTab === 'papeis'
              ? 'bg-paperalt text-accent border border-ink/25 font-bold'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Matriz: PM vs Tech Lead vs Agente</span>
        </button>

        <button
          onClick={() => setActiveSubTab('anatomia')}
          className={`px-3.5 py-1.5  transition-all flex items-center gap-1.5 ${
            activeSubTab === 'anatomia'
              ? 'bg-paperalt text-accent border border-ink/25 font-bold'
              : 'text-muted hover:text-ink'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Anatomia do Spec Kit (spec/plan/tasks)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('setup')}
          className={`px-3.5 py-1.5  transition-all flex items-center gap-1.5 ${
            activeSubTab === 'setup'
              ? 'bg-paperalt text-accent border border-ink/25 font-bold'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Como Instalar e Rodar no Terminal</span>
        </button>
      </div>

      {/* SUBTAB 1: FLUXO DE FASES DO SDD */}
      {activeSubTab === 'fluxo' && (
        <div className="space-y-6 animate-fadeIn">

          {/* Path Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-paperalt p-4  border border-ink/20 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-ink font-semibold">
                Progressão de Refinamento: What & Why antes de How
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted">Modo de Rota:</span>
              <button
                onClick={() => setIsShortPath(false)}
                className={`px-2.5 py-1 rounded transition-all ${
                  !isShortPath
                    ? 'bg-accent/15 text-accent border border-accent/45 font-bold'
                    : 'bg-paper text-muted hover:text-ink'
                }`}
              >
                Caminho Completo (9 Fases)
              </button>
              <button
                onClick={() => setIsShortPath(true)}
                className={`px-2.5 py-1 rounded transition-all ${
                  isShortPath
                    ? 'bg-accent/15 text-accent border border-accent/45 font-bold'
                    : 'bg-paper text-muted hover:text-ink'
                }`}
              >
                Caminho Curto (5 Fases)
              </button>
            </div>
          </div>

          {/* Stepper Grid of Phases */}
          <div className={`grid gap-2 ${isShortPath ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-3 sm:grid-cols-5 md:grid-cols-9'}`}>
            {displayedPhases.map((phase) => {
              const isSelected = selectedPhaseId === phase.id;

              return (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhaseId(phase.id)}
                  className={`p-2.5  border text-left font-mono transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-paperalt border-accent ring-1 ring-accent/45 '
                      : 'bg-paper border-ink/20 hover:border-ink/25 hover:bg-paperalt'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-muted mb-1">
                    <span>0{phase.phaseNumber}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-accent' : 'bg-linesoft'}`} />
                  </div>
                  <div className="text-[11px] font-bold text-ink capitalize truncate">
                    {phase.id}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Phase Card */}
          <div className="bg-paperalt p-6  border border-ink/20 space-y-6">

            {/* Phase Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-ink/20 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/25 font-bold">
                    FASE 0{currentPhase.phaseNumber}
                  </span>
                  <span className={`font-mono text-xs uppercase px-2 py-0.5 rounded border font-semibold ${getOwnerBadge(currentPhase.primaryOwner)}`}>
                    Dono Principal: {currentPhase.primaryOwner}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-ink font-sans">
                  {currentPhase.name}
                </h2>
              </div>

              <span className="text-xs font-mono text-muted bg-paper px-3 py-1.5 rounded border border-ink/20">
                Artefato: <strong className="text-ink">{currentPhase.expectedArtifact}</strong>
              </span>
            </div>

            {/* Objective & Description */}
            <div className="bg-paper p-4  border border-ink/20 text-xs leading-relaxed space-y-2">
              <span className="text-accent font-mono font-bold uppercase block text-[11px]">
                Objetivo Central da Fase:
              </span>
              <p className="text-ink text-sm">
                {currentPhase.objective}
              </p>
            </div>

            {/* What it is vs What it is not */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4  bg-accent/10 border border-accent/35 space-y-1.5">
                <span className="font-mono text-accent font-bold uppercase flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> O que É:
                </span>
                <p className="text-inksoft leading-relaxed">
                  {currentPhase.whatItIs}
                </p>
              </div>

              <div className="p-4  bg-rose-500/10 border border-rose-600/30 space-y-1.5">
                <span className="font-mono text-rose-700 font-bold uppercase flex items-center gap-1.5 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" /> O que NÃO É:
                </span>
                <p className="text-inksoft leading-relaxed">
                  {currentPhase.whatItIsNot}
                </p>
              </div>
            </div>

            {/* Approval Question Callout */}
            <div className="p-4  bg-amber-500/15 border border-amber-600/35 text-xs text-amber-700 space-y-1">
              <span className="font-mono text-amber-700 font-bold uppercase block text-[10px]">
                Pergunta de Aprovação Humana Obrigatória (Checkpoint Gate):
              </span>
              <p className="text-ink font-medium italic">
                {currentPhase.approvalQuestion}
              </p>
            </div>

            {/* Key Checkpoints Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-muted font-bold block">
                Itens Críticos a Validar nesta Fase:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                {currentPhase.keyCheckpoints.map((cp, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-paper border border-ink/20 text-inksoft flex items-start gap-2 text-[11px]">
                    <span className="text-accent font-bold">✓</span>
                    <span>{cp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Copyable Prompt Template for this Phase */}
            <div className="bg-paper  border border-ink/20 overflow-hidden text-xs font-mono">
              <div className="p-3 bg-paperalt border-b border-ink/20 flex items-center justify-between">
                <span className="text-inksoft flex items-center gap-1.5 text-[11px]">
                  <Terminal className="w-3.5 h-3.5 text-accent" />
                  Prompt Copiável para Executar com o Agente (Antigravity / Claude Code / Cursor):
                </span>
                <button
                  onClick={() => handleCopy(currentPhase.promptTemplate, currentPhase.id)}
                  className="px-2.5 py-1 rounded bg-paperalt hover:bg-linesoft text-ink flex items-center gap-1 text-[11px] transition-colors"
                >
                  {copiedKey === currentPhase.id ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === currentPhase.id ? 'Copiado!' : 'Copiar Prompt'}</span>
                </button>
              </div>
              <div className="p-4 text-[11px] text-inksoft leading-relaxed whitespace-pre-wrap overflow-x-auto">
                {currentPhase.promptTemplate}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 2: MATRIZ DE PAPÉIS & RESPONSABILIDADES */}
      {activeSubTab === 'papeis' && (
        <div className="space-y-6 animate-fadeIn">

          <div className="bg-paperalt p-6  border border-ink/20 space-y-6">
            <div className="text-xs font-mono uppercase tracking-wider text-accent font-bold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Divisão de Responsabilidades no Spec-Driven Development
            </div>

            <p className="text-xs text-muted leading-relaxed">
              O maior erro ao adotar Coding Agents é tratá-los como donos de produto ou desenvolvedores autônomos sem supervisão.
              No SDD, a autoria e a aprovação continuam sendo rigorosamente humanas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SDD_ROLES.map((role) => (
                <div key={role.role} className="bg-paper p-5  border border-ink/20 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="border-b border-ink/20 pb-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/25 font-bold block w-max mb-1">
                        {role.ownership}
                      </span>
                      <h3 className="text-sm font-bold text-ink font-sans">
                        {role.title}
                      </h3>
                    </div>

                    {/* What it does */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-accent font-bold block">
                        O que FAZ:
                      </span>
                      {role.does.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-inksoft">
                          <CheckCircle2 className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* What it does NOT */}
                    <div className="space-y-1.5 pt-2 border-t border-ink/20">
                      <span className="text-[10px] font-mono uppercase text-rose-700 font-bold block">
                        O que NÃO FAZ:
                      </span>
                      {role.doesNot.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-muted">
                          <span className="text-rose-700 font-bold shrink-0">✕</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Golden Takeaway */}
            <div className="bg-paper p-4  border border-ink/20 text-xs font-mono text-inksoft space-y-1">
              <span className="text-accent font-bold block uppercase">
                O Agente Não é Aprovador:
              </span>
              <p>
                O agente não é um terceiro decisor. Ele lê repositórios, sugere esquemas, aponta ambiguidades e escreve código. A aprovação de cada artefato (Spec, Plan, Tasks e Release) é <strong>100% humana</strong>.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 3: ANATOMIA DO SPEC KIT (EXEMPLO REAL) */}
      {activeSubTab === 'anatomia' && (
        <div className="space-y-6 animate-fadeIn">

          <div className="bg-paperalt p-6  border border-ink/20 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-ink/20 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/25 font-bold block w-max mb-1">
                  EXEMPLO REAL COMPLETO
                </span>
                <h2 className="text-base font-bold text-ink font-sans">
                  {SDD_SAMPLE_SPEC.title}
                </h2>
              </div>

              {/* Artifact Selector Tabs */}
              <div className="flex items-center gap-1.5 font-mono text-xs bg-paper p-1  border border-ink/20">
                <button
                  onClick={() => setActiveArtifactTab('spec')}
                  className={`px-3 py-1.5 rounded transition-all ${
                    activeArtifactTab === 'spec'
                      ? 'bg-paperalt text-accent font-bold'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  spec.md (PM)
                </button>
                <button
                  onClick={() => setActiveArtifactTab('plan')}
                  className={`px-3 py-1.5 rounded transition-all ${
                    activeArtifactTab === 'plan'
                      ? 'bg-paperalt text-accent font-bold'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  plan.md (Tech Lead)
                </button>
                <button
                  onClick={() => setActiveArtifactTab('tasks')}
                  className={`px-3 py-1.5 rounded transition-all ${
                    activeArtifactTab === 'tasks'
                      ? 'bg-paperalt text-accent font-bold'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  tasks.md (Tasks)
                </button>
              </div>
            </div>

            {/* Document Viewer */}
            <div className="bg-paper  border border-ink/20 overflow-hidden font-mono text-xs">
              <div className="p-3 bg-paperalt border-b border-ink/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-inksoft">
                  <FileText className="w-3.5 h-3.5 text-accent" />
                  <span>
                    {activeArtifactTab === 'spec' ? 'spec.md — O Contrato de Produto' : activeArtifactTab === 'plan' ? 'plan.md — A Abordagem Técnica' : 'tasks.md — A Decomposição Atômica'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const content = activeArtifactTab === 'spec' ? SDD_SAMPLE_SPEC.specMd : activeArtifactTab === 'plan' ? SDD_SAMPLE_SPEC.planMd : SDD_SAMPLE_SPEC.tasksMd;
                      handleCopy(content, activeArtifactTab);
                    }}
                    className="px-2.5 py-1 rounded bg-paperalt hover:bg-linesoft text-ink flex items-center gap-1 text-[11px] transition-colors"
                  >
                    {copiedKey === activeArtifactTab ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === activeArtifactTab ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="p-6 text-[11px] text-inksoft leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[550px] overflow-y-auto">
                {activeArtifactTab === 'spec' && SDD_SAMPLE_SPEC.specMd}
                {activeArtifactTab === 'plan' && SDD_SAMPLE_SPEC.planMd}
                {activeArtifactTab === 'tasks' && SDD_SAMPLE_SPEC.tasksMd}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 4: SETUP E COMANDOS CLI */}
      {activeSubTab === 'setup' && (
        <div className="space-y-6 animate-fadeIn">

          <div className="bg-paperalt p-6  border border-ink/20 space-y-6">
            <div className="text-xs font-mono uppercase tracking-wider text-accent font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Como Instalar e Inicializar o Spec Kit no Repositório da Squad
            </div>

            <div className="space-y-4 text-xs font-mono">

              {/* Step 1: Install specify-cli */}
              <div className="bg-paper p-4  border border-ink/20 space-y-2">
                <div className="flex items-center justify-between text-inksoft">
                  <span className="font-bold text-accent">Passo 1: Instalar a CLI oficial do Spec Kit</span>
                  <button
                    onClick={() => handleCopy('uv tool install specify-cli', 'cmd1')}
                    className="text-[11px] text-muted hover:text-ink flex items-center gap-1"
                  >
                    {copiedKey === 'cmd1' ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <div className="bg-ink p-3 border-2 border-ink text-paper/90 font-mono text-xs">
                  uv tool install specify-cli
                </div>
                <p className="text-[11px] text-muted">
                  Requer Python 3.11+ e o gerenciador ultrarrápido <code>uv</code>.
                </p>
              </div>

              {/* Step 2: Initialize in repo */}
              <div className="bg-paper p-4  border border-ink/20 space-y-2">
                <div className="flex items-center justify-between text-inksoft">
                  <span className="font-bold text-accent">Passo 2: Inicializar a integração com o Agente escolhido</span>
                </div>
                <p className="text-[11px] text-muted">
                  Execute no diretório do projeto o comando de acordo com a ferramenta adotada pela squad:
                </p>
                <div className="space-y-2">
                  <div className="bg-ink p-2.5 border-2 border-ink text-paper/90 font-mono text-xs flex justify-between items-center">
                    <span>specify init . --integration claude</span>
                    <button onClick={() => handleCopy('specify init . --integration claude', 'cmd-claude')} className="text-paper/60 hover:text-paper">Copiar</button>
                  </div>
                  <div className="bg-ink p-2.5 border-2 border-ink text-paper/90 font-mono text-xs flex justify-between items-center">
                    <span>specify init . --integration cursor-agent</span>
                    <button onClick={() => handleCopy('specify init . --integration cursor-agent', 'cmd-cursor')} className="text-paper/60 hover:text-paper">Copiar</button>
                  </div>
                  <div className="bg-ink p-2.5 border-2 border-ink text-paper/90 font-mono text-xs flex justify-between items-center">
                    <span>specify init . --integration codex</span>
                    <button onClick={() => handleCopy('specify init . --integration codex', 'cmd-codex')} className="text-paper/60 hover:text-paper">Copiar</button>
                  </div>
                </div>
              </div>

              {/* Step 3: Git Versioning */}
              <div className="bg-paper p-4  border border-ink/20 space-y-2 text-inksoft">
                <span className="font-bold text-accent">Passo 3: Manter as Specs versionadas no Git</span>
                <p className="text-[11px] text-muted leading-relaxed">
                  Ao contrário do Jira que fica desconectado do código, as especificações do Spec Kit vivem na mesma branch da funcionalidade. Quando a feature muda, a spec é atualizada no mesmo Pull Request, garantindo que a documentação nunca fique defasada.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
