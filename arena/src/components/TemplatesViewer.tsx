import React, { useState } from 'react';
import { PRACTICAL_TEMPLATES } from '../data/templates';
import { Copy, Check, FileText, Download } from 'lucide-react';

export const TemplatesViewer: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(PRACTICAL_TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);

  const selectedTemplate = PRACTICAL_TEMPLATES.find(t => t.id === selectedTemplateId) || PRACTICAL_TEMPLATES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedTemplate.markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedTemplate.markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedTemplate.id}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/25 font-semibold">
          TOOLKIT DE ESPECIFICAÇÃO
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink font-sans">
          Templates & Artefatos de <span className="text-accent">AI Product Management</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Documentos prontos para o dia a dia da squad: PRDs estruturadas para agentes, matrizes de avaliação para release gates, ledgers de FinOps e planos de incident response.
        </p>
      </div>

      {/* Selector & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Templates List */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase text-muted tracking-wider font-bold block mb-2">
            Selecione o Template:
          </span>
          {PRACTICAL_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplateId === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplateId(tmpl.id)}
                className={`w-full text-left p-3.5  border transition-all ${
                  isSelected
                    ? 'bg-paperalt border-accent ring-1 ring-accent/45'
                    : 'bg-paperalt border-ink/20 hover:border-ink/25 hover:bg-paperalt'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase bg-accent/10 text-accent px-1.5 py-0.2 rounded border border-accent/25 font-semibold">
                    {tmpl.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-ink font-sans mt-1">
                  {tmpl.title}
                </h4>
                <p className="text-[11px] text-muted mt-1 line-clamp-2">
                  {tmpl.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Markdown Document Viewer */}
        <div className="lg:col-span-2 bg-paperalt  border border-ink/20 overflow-hidden shadow-brutal flex flex-col">

          {/* Top Action Bar */}
          <div className="p-3 bg-paperalt border-b border-ink/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono text-ink font-semibold">
                {selectedTemplate.id}.md
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="text-xs font-mono px-3 py-1.5 rounded bg-paperalt hover:bg-linesoft text-ink flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Markdown'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="text-xs font-mono px-3 py-1.5 rounded bg-accent/10 hover:bg-accentdark/15 text-accent border border-accent/35 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar .md</span>
              </button>
            </div>
          </div>

          {/* Document Content View */}
          <div className="p-6 font-mono text-xs text-inksoft leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[600px] overflow-y-auto">
            {selectedTemplate.markdownContent}
          </div>

        </div>

      </div>

    </div>
  );
};
