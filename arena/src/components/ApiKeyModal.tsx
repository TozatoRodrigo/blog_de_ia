import React, { useState } from 'react';
import { Key, X, Check, ShieldCheck, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(keyInput.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0e131f] border border-ink/20  max-w-md w-full p-6 space-y-4 shadow-brutal relative font-mono">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-paperalt text-muted hover:text-ink transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 text-accent">
          <Key className="w-5 h-5" />
          <h3 className="text-base font-bold text-ink font-sans">
            Configurar Mentor de IA em Tempo Real
          </h3>
        </div>

        <p className="text-xs text-inksoft leading-relaxed">
          O simulador do <strong>Produto com IA</strong> já possui um motor heurístico calibrado que funciona <strong>100% offline</strong>.
        </p>

        <p className="text-xs text-muted leading-relaxed">
          Se desejar feedback generativo dinâmico do modelo <strong className="text-ink">Gemini 1.5 Flash</strong> sobre suas reflexões abertas, insira sua chave gratuita da Google AI Studio:
        </p>

        <div className="space-y-1.5">
          <label className="text-[11px] text-muted uppercase tracking-wider">
            Google AI Studio API Key:
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-paperalt border border-ink/20 rounded px-3 py-2 text-xs text-ink placeholder-muted focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted pt-1">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline flex items-center gap-1"
          >
            Obter chave gratuita no Google AI Studio <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="bg-paperalt p-3 rounded border border-ink/20 text-[11px] text-muted flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <span>Sua chave é armazenada exclusivamente no LocalStorage do seu navegador. Nunca é enviada a nenhum servidor terceiro.</span>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-ink/20">
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs text-rose-700 hover:text-rose-700 transition-colors"
            >
              Remover Chave
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs text-muted hover:text-ink"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded bg-accent hover:bg-accentdark text-paper font-bold text-xs transition-all flex items-center gap-1"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{saved ? 'Salvo!' : 'Salvar Chave'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
