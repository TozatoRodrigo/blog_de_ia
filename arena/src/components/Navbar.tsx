import React from 'react';
import { Sparkles, Compass, ShieldCheck, FileText, BookOpen, Key, Workflow, GitMerge } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  completedCasesCount: number;
  totalCasesCount: number;
  onOpenApiKeyModal: () => void;
  hasCustomKey: boolean;
}

const TABS = [
  { id: 'cases', label: 'Cases', icon: Sparkles },
  { id: 'sdd', label: 'Spec Kit', icon: GitMerge },
  { id: 'stack', label: 'Stack & OS', icon: Workflow },
  { id: 'trilhas', label: 'Trilhas', icon: Compass },
  { id: 'radar', label: 'Radar', icon: ShieldCheck },
  { id: 'templates', label: 'Templates', icon: FileText },
  { id: 'guias', label: 'Guias', icon: BookOpen },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  completedCasesCount,
  totalCasesCount,
  onOpenApiKeyModal,
  hasCustomKey,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <div className="warning-stripe" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Brand & Identity — logo oficial */}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
            onClick={() => setActiveTab('cases')}
          >
            <span className="font-display text-lg tracking-tight uppercase leading-none text-ink group-hover:text-accent transition-colors">
              Produto&nbsp;Com&nbsp;<span className="text-accent">IA</span>
            </span>
            <span className="hidden sm:inline-flex font-mono text-[10px] uppercase tracking-widest text-muted border border-ink/30 px-1.5 py-0.5">
              Arena&nbsp;PM
            </span>
          </div>

          {/* Navigation Links — mono uppercase, active accent */}
          <nav className="hidden xl:flex items-center">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-mono uppercase tracking-wider text-xs px-3 py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                    isActive
                      ? 'text-accent border-accent'
                      : 'text-ink border-transparent hover:bg-ink hover:text-paper'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.id === 'cases' && completedCasesCount > 0 && (
                    <span className="ml-1 px-1.5 text-[10px] bg-accent text-paper font-bold">
                      {completedCasesCount}/{totalCasesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenApiKeyModal}
              title={hasCustomKey ? 'Chave Gemini configurada' : 'Configurar Chave de IA para Mentoria em Tempo Real'}
              className={`font-mono uppercase tracking-wider text-xs px-2.5 py-1.5 border-2 flex items-center gap-1.5 transition-colors ${
                hasCustomKey
                  ? 'border-accent bg-accent/10 text-accentdark'
                  : 'border-ink bg-paper text-ink hover:bg-ink hover:text-paper'
              }`}
            >
              <Key className="w-3 h-3" />
              <span className="hidden sm:inline">
                {hasCustomKey ? 'IA Ativa' : 'Mentor IA'}
              </span>
            </button>

            <a
              href="https://www.produtocomia.com.br"
              className="font-mono uppercase tracking-wider text-xs px-2.5 py-1.5 border-2 border-ink bg-ink text-paper hover:bg-accent hover:border-accent transition-colors hidden md:inline-flex"
            >
              ← Portal
            </a>
          </div>

        </div>

        {/* Mobile / Tablet Submenu Bar */}
        <div className="flex xl:hidden overflow-x-auto py-2 gap-1 border-t border-ink/20 text-xs no-scrollbar">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 whitespace-nowrap font-mono uppercase tracking-wider border ${
                  isActive
                    ? 'bg-ink text-paper border-ink'
                    : 'text-muted border-ink/25 hover:text-ink hover:border-ink/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
