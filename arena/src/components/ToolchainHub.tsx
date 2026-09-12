import React, { useState } from 'react';
import { TOOLCHAIN_LIST, WORKFLOW_PLAYBOOKS } from '../data/toolchain';
import {
  Layers,
  Terminal,
  Sparkles,
  Cpu,
  Copy,
  Check,
  Lightbulb,
  Workflow,
  FolderGit2,
  FileCode,
  CheckCircle2
} from 'lucide-react';

export const ToolchainHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'arquitetura' | 'ferramentas' | 'playbooks' | 'configs'>('arquitetura');
  const [selectedToolId, setSelectedToolId] = useState<string>(TOOLCHAIN_LIST[0].id);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(WORKFLOW_PLAYBOOKS[0].id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedTool = TOOLCHAIN_LIST.find(t => t.id === selectedToolId) || TOOLCHAIN_LIST[0];
  const selectedPlaybook = WORKFLOW_PLAYBOOKS.find(p => p.id === selectedPlaybookId) || WORKFLOW_PLAYBOOKS[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/25 font-semibold">
          AI PRODUCT MANAGER OPERATING SYSTEM (OS)
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink font-sans">
          Como o <span className="text-accent">AI-First PM</span> se Organiza no Dia a Dia
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Do discovery de usuários com NotebookLM e Genspark, passando pelo segundo cérebro no Obsidian e Notion, até a execução com Antigravity, Claude Code e Codex. A esteira completa sem achismos.
        </p>
      </div>

      {/* Navigation SubTabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 border-b border-ink/20 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('arquitetura')}
          className={`px-3.5 py-1.5  transition-all flex items-center gap-1.5 ${
            activeSubTab === 'arquitetura'
              ? 'bg-paperalt text-accent border border-ink/25 font-bold'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Arquitetura da Stack</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ferramentas')}
          className={`px-3.5 py-1.5  transition-all flex items-center gap-1.5 ${
            activeSubTab === 'ferramentas'
              ? 'bg-paperalt text-accent border border-ink/25 font-bold'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Guia das 7 Ferramentas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('playbooks')}
          className={`px-3.5 py-1.5  transition-all flex items-center gap-1.5 ${
            activeSubTab === 'playbooks'
              ? 'bg-paperalt text-accent border border-ink/25 font-bold'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Playbooks de Rotina Diária</span>
        </button>

        <button
          onClick={() => setActiveSubTab('configs')}
          className={`px-3.5 py-1.5  transition-all flex items-center gap-1.5 ${
            activeSubTab === 'configs'
              ? 'bg-paperalt text-accent border border-ink/25 font-bold'
              : 'text-muted hover:text-ink'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Configs Prontas (.agent/rules, CLAUDE.md)</span>
        </button>
      </div>

      {/* SUBTAB 1: ARQUITETURA DA STACK */}
      {activeSubTab === 'arquitetura' && (
        <div className="space-y-6 animate-fadeIn">

          <div className="bg-paperalt p-6  border border-ink/20 space-y-6">
            <div className="text-xs font-mono uppercase tracking-wider text-accent font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              O Ciclo Integrado de 4 Camadas do Product Manager AI-First
            </div>

            {/* 4 Layers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              {/* Layer 1 */}
              <div className="bg-paper p-4  border border-ink/20 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-600/10 text-blue-700 border border-blue-600/20 font-bold block w-max">
                    CAMADA 01
                  </span>
                  <h3 className="text-sm font-bold text-ink font-sans">
                    Descoberta & Pesquisa Externa
                  </h3>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Mineração de evidências sem alucinação e inteligência competitiva autônoma.
                  </p>
                </div>
                <div className="pt-3 border-t border-ink/20 font-mono text-xs space-y-1">
                  <div className="text-ink font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    NotebookLM
                  </div>
                  <div className="text-ink font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Genspark
                  </div>
                  <span className="text-[10px] text-muted block mt-1">Transcrições & Sparkpages</span>
                </div>
              </div>

              {/* Layer 2 */}
              <div className="bg-paper p-4  border border-ink/20 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-600/10 text-purple-700 border border-purple-600/20 font-bold block w-max">
                    CAMADA 02
                  </span>
                  <h3 className="text-sm font-bold text-ink font-sans">
                    Pensamento & Segundo Cérebro
                  </h3>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Cofre privado do PM em Markdown puro: hipóteses, grafos conceituais e canvas.
                  </p>
                </div>
                <div className="pt-3 border-t border-ink/20 font-mono text-xs space-y-1">
                  <div className="text-ink font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    Obsidian
                  </div>
                  <span className="text-[10px] text-muted block">Links Bidirecionais</span>
                  <span className="text-[10px] text-muted block">Decision Logs & Canvas</span>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="bg-paper p-4  border border-ink/20 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 border border-amber-600/25 font-bold block w-max">
                    CAMADA 03
                  </span>
                  <h3 className="text-sm font-bold text-ink font-sans">
                    Alinhamento & Especificação
                  </h3>
                  <p className="text-[11px] text-muted leading-relaxed">
                    A fonte única de verdade da squad: PRDs vivas, schemas JSON e bases de incidentes.
                  </p>
                </div>
                <div className="pt-3 border-t border-ink/20 font-mono text-xs space-y-1">
                  <div className="text-ink font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Notion
                  </div>
                  <span className="text-[10px] text-muted block">PRDs Vivas & Databases</span>
                  <span className="text-[10px] text-muted block">Conexão MCP com IA</span>
                </div>
              </div>

              {/* Layer 4 */}
              <div className="bg-paper p-4  border border-ink/20 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/25 font-bold block w-max">
                    CAMADA 04
                  </span>
                  <h3 className="text-sm font-bold text-ink font-sans">
                    Engenharia Agêntica & Execução
                  </h3>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Subagents em background, inspeção de repositório no terminal e prototipagem em 2h.
                  </p>
                </div>
                <div className="pt-3 border-t border-ink/20 font-mono text-xs space-y-1">
                  <div className="text-ink font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Antigravity (AGY)
                  </div>
                  <div className="text-ink font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Claude Code & Codex
                  </div>
                  <span className="text-[10px] text-muted block mt-1">.agent/rules & CLAUDE.md</span>
                </div>
              </div>

            </div>

            {/* Practical Synthesis Manifesto */}
            <div className="bg-paper p-5  border border-ink/20 text-xs leading-relaxed space-y-2">
              <span className="text-accent font-mono font-bold uppercase block">
                Princípio Operacional Inegociável:
              </span>
              <p className="text-inksoft">
                O PM tradicional passava o dia trocando e-mails, participando de 7 reuniões de alinhamento e escrevendo cards no Jira que a engenharia interpretava de forma diferente.
                O <strong className="text-ink">AI-First PM</strong> opera como um maestro: usa o <strong>NotebookLM</strong> e o <strong>Genspark</strong> para sintetizar em 30 minutos o que antes levava dias de pesquisa; organiza hipóteses no <strong>Obsidian</strong>; formaliza contratos executáveis no <strong>Notion</strong>; e valida protótipos e testes diretamente com <strong>Antigravity</strong> e <strong>Claude Code</strong>.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 2: GUIA DETALHADO DAS 7 FERRAMENTAS */}
      {activeSubTab === 'ferramentas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fadeIn">

          {/* Tool Selector List */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-muted tracking-wider font-bold block mb-2">
              Selecione a Ferramenta:
            </span>
            {TOOLCHAIN_LIST.map((tool) => {
              const isSelected = selectedToolId === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className={`w-full text-left p-3.5  border transition-all ${
                    isSelected
                      ? 'bg-paperalt border-accent ring-1 ring-accent/45'
                      : 'bg-paperalt border-ink/20 hover:border-ink/25 hover:bg-paperalt'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase bg-accent/10 text-accent px-1.5 py-0.2 rounded border border-accent/25 font-semibold">
                      {tool.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-ink font-sans mt-1">
                    {tool.name}
                  </h4>
                  <p className="text-[11px] text-muted mt-1 line-clamp-2">
                    {tool.roleInPMSuit}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Tool Detail View */}
          <div className="lg:col-span-2 bg-paperalt p-6  border border-ink/20 space-y-6">

            {/* Tool Header */}
            <div className="border-b border-ink/20 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase bg-accent/10 text-accent px-2.5 py-0.5 rounded border border-accent/35 font-bold">
                  {selectedTool.badge}
                </span>
                <span className="text-xs font-mono text-muted uppercase">{selectedTool.category}</span>
              </div>
              <h2 className="text-xl font-bold text-ink font-sans">
                {selectedTool.name}
              </h2>
              <p className="text-xs text-inksoft leading-relaxed font-mono">
                {selectedTool.tagline}
              </p>
            </div>

            {/* Why Use & How to Integrate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-paper p-4  border border-ink/20 space-y-2">
                <span className="font-mono text-accent font-bold uppercase block text-[11px]">
                  Por que o AI PM precisa:
                </span>
                <p className="text-inksoft leading-relaxed">
                  {selectedTool.whyUse}
                </p>
              </div>

              <div className="bg-paper p-4  border border-ink/20 space-y-2">
                <span className="font-mono text-accent font-bold uppercase block text-[11px]">
                  Como integrar na rotina:
                </span>
                <p className="text-inksoft leading-relaxed">
                  {selectedTool.howToIntegrate}
                </p>
              </div>
            </div>

            {/* Practical Step-by-Step Use Cases */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-inksoft font-bold flex items-center gap-2">
                <Workflow className="w-4 h-4 text-accent" />
                Casos Práticos Passo a Passo no Dia a Dia
              </h3>

              <div className="space-y-3">
                {selectedTool.practicalUseCases.map((uc, idx) => (
                  <div key={idx} className="bg-paper p-4  border border-ink/20 space-y-2">
                    <h4 className="text-xs font-bold text-ink font-sans">
                      {uc.title}
                    </h4>
                    <p className="text-[11px] text-muted">
                      {uc.description}
                    </p>
                    <div className="pt-2 border-t border-ink/20 space-y-1 text-xs">
                      {uc.stepByStep.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-inksoft text-[11px]">
                          <span className="font-mono text-accent font-bold shrink-0">
                            {sIdx + 1}.
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip Callout */}
            <div className="p-3.5  bg-amber-500/15 border border-amber-600/35 flex items-start gap-2.5 text-xs text-amber-700">
              <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-mono uppercase block text-[10px] text-amber-700 mb-0.5">Dica Pro do Especialista:</strong>
                {selectedTool.proTip}
              </div>
            </div>

            {/* Copyable Template / Prompt if present */}
            {selectedTool.promptOrConfigTemplate && (
              <div className="bg-paper  border border-ink/20 overflow-hidden text-xs">
                <div className="p-3 bg-paperalt border-b border-ink/20 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2 text-inksoft">
                    <FileCode className="w-3.5 h-3.5 text-accent" />
                    <span>{selectedTool.promptOrConfigTemplate.title}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedTool.promptOrConfigTemplate!.code, selectedTool.id)}
                    className="text-[11px] px-2.5 py-1 rounded bg-paperalt hover:bg-linesoft text-ink flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === selectedTool.id ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === selectedTool.id ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="p-4 font-mono text-[11px] text-inksoft whitespace-pre-wrap overflow-x-auto max-h-56 overflow-y-auto">
                  {selectedTool.promptOrConfigTemplate.code}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* SUBTAB 3: PLAYBOOKS DE ROTINA DIÁRIA */}
      {activeSubTab === 'playbooks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fadeIn">

          {/* Playbooks List */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-muted tracking-wider font-bold block mb-2">
              Selecione o Playbook:
            </span>
            {WORKFLOW_PLAYBOOKS.map((playbook) => {
              const isSelected = selectedPlaybookId === playbook.id;
              return (
                <button
                  key={playbook.id}
                  onClick={() => setSelectedPlaybookId(playbook.id)}
                  className={`w-full text-left p-3.5  border transition-all ${
                    isSelected
                      ? 'bg-paperalt border-accent ring-1 ring-accent/45'
                      : 'bg-paperalt border-ink/20 hover:border-ink/25 hover:bg-paperalt'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-muted">
                      {playbook.duration}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-ink font-sans mt-0.5">
                    {playbook.title}
                  </h4>
                  <p className="text-[11px] text-muted mt-1 line-clamp-2">
                    {playbook.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Playbook Detail Stepper View */}
          <div className="lg:col-span-2 bg-paperalt p-6  border border-ink/20 space-y-6">

            <div className="border-b border-ink/20 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
                  TEMPO ESTIMADO: {selectedPlaybook.duration}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedPlaybook.toolsInvolved.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono bg-paper text-inksoft px-2 py-0.5 rounded border border-ink/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <h2 className="text-lg font-bold text-ink font-sans">
                {selectedPlaybook.title}
              </h2>
              <p className="text-xs text-inksoft leading-relaxed">
                <strong className="text-accent font-mono uppercase text-[11px]">Objetivo:</strong> {selectedPlaybook.objective}
              </p>
            </div>

            {/* Stages Stepper */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted font-bold block">
                Etapas Sequenciais do Fluxo:
              </span>

              <div className="space-y-3">
                {selectedPlaybook.stages.map((stage) => (
                  <div key={stage.stageNumber} className="bg-paper p-4  border border-ink/20 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/35 text-accent flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      {stage.stageNumber}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-accent font-bold uppercase text-[11px]">
                          {stage.toolName}
                        </span>
                      </div>
                      <p className="text-ink leading-relaxed">
                        {stage.action}
                      </p>
                      <div className="pt-1 text-[11px] text-muted font-mono">
                        <strong className="text-inksoft">Artefato Gerado:</strong> {stage.output}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Golden Rule Callout */}
            <div className="p-4  bg-accent/10 border border-accent/45 flex items-start gap-2.5 text-xs text-accentdark">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="font-mono uppercase block text-[10px] text-accent mb-0.5">Regra de Ouro do AI PM:</strong>
                {selectedPlaybook.pmGoldenRule}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 4: CONFIGURAÇÕES E SCRIPTS PRONTOS */}
      {activeSubTab === 'configs' && (
        <div className="space-y-6 animate-fadeIn">

          <div className="bg-paperalt p-6  border border-ink/20 space-y-6">
            <div className="text-xs font-mono uppercase tracking-wider text-accent font-bold flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              Arquivos de Configuração de Squad Prontos para Uso
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Copie e cole estes arquivos diretamente no repositório da sua equipe para alinhar os agentes de código (Antigravity, Claude Code, Cursor) às melhores práticas de governança de produto e FinOps.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Config 1: Antigravity Rules */}
              <div className="bg-paper  border border-ink/20 overflow-hidden flex flex-col justify-between text-xs">
                <div>
                  <div className="p-3 bg-paperalt border-b border-ink/20 flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2 text-ink">
                      <FolderGit2 className="w-3.5 h-3.5 text-accent" />
                      <span>.agent/rules/ai-pm-governance.md</span>
                    </div>
                    <button
                      onClick={() => handleCopy(`---\ndescription: Regras de produto com IA para o time\nglobs: "**/*"\n---\n# Regras de Produto e Engenharia de IA\n\n1. Nenhuma nova chamada a LLM/SLM deve ser adicionada sem schema de entrada e saída estrito (JSON Schema ou Pydantic).\n2. Todo agente autônomo com acesso a ferramentas de efeito externo DEVE conter:\n   - max_steps configurado para teto de 3 iterações.\n   - Kill-switch via feature flag.\n   - Chave de idempotência única.\n3. Se a latência for > 2s, implementar streaming obrigatório.`, 'rules-config')}
                      className="text-[11px] px-2 py-0.5 rounded bg-paperalt hover:bg-linesoft text-ink flex items-center gap-1"
                    >
                      {copiedKey === 'rules-config' ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'rules-config' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <div className="p-4 font-mono text-[11px] text-inksoft leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
{`---
description: Regras de produto com IA para o time
globs: "**/*"
---
# Regras de Produto e Engenharia de IA

1. Nenhuma nova chamada a LLM/SLM deve ser adicionada sem schema de entrada e saída estrito (JSON Schema ou Pydantic).
2. Todo agente autônomo com acesso a ferramentas de efeito externo DEVE conter:
   - max_steps configurado para teto de 3 iterações.
   - Kill-switch via feature flag.
   - Chave de idempotência única.
3. Se a latência for > 2s, implementar streaming obrigatório.`}
                  </div>
                </div>
                <div className="p-3 border-t border-ink/20 bg-paperalt text-[11px] text-muted font-mono">
                  Finalidade: Força o Antigravity a respeitar os limites de custo e governança em qualquer código gerado.
                </div>
              </div>

              {/* Config 2: CLAUDE.md */}
              <div className="bg-paper  border border-ink/20 overflow-hidden flex flex-col justify-between text-xs">
                <div>
                  <div className="p-3 bg-paperalt border-b border-ink/20 flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2 text-ink">
                      <Terminal className="w-3.5 h-3.5 text-accent" />
                      <span>CLAUDE.md</span>
                    </div>
                    <button
                      onClick={() => handleCopy(`# DIRETRIZES DE PRODUTO — CLAUDE CODE\n\n## Filosofia da Squad\n- Somos uma squad AI-First com foco em unit economics sustentáveis.\n- Priorize Small Models e cache determinístico antes de modelos de alto custo.\n\n## Comandos Rápidos de Validação\n- Rodar Evals: npm run test:evals\n- Checar Linters: npm run lint\n- Simular FinOps: npm run finops:ledger`, 'claude-config')}
                      className="text-[11px] px-2 py-0.5 rounded bg-paperalt hover:bg-linesoft text-ink flex items-center gap-1"
                    >
                      {copiedKey === 'claude-config' ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'claude-config' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <div className="p-4 font-mono text-[11px] text-inksoft leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
{`# DIRETRIZES DE PRODUTO — CLAUDE CODE

## Filosofia da Squad
- Somos uma squad AI-First com foco em unit economics sustentáveis.
- Priorize Small Models e cache determinístico antes de modelos de alto custo.

## Comandos Rápidos de Validação
- Rodar Evals: npm run test:evals
- Checar Linters: npm run lint
- Simular FinOps: npm run finops:ledger`}
                  </div>
                </div>
                <div className="p-3 border-t border-ink/20 bg-paperalt text-[11px] text-muted font-mono">
                  Finalidade: Guia o Claude Code no terminal para nunca sugerir arquiteturas inflacionadas sem Evals.
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
