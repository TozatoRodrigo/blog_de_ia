# Produto com IA — Case Arena & Learning Hub
### Simulador Interativo & Hub de Especialização para AI-First Product Managers

> **"De PM determinístico para PM probabilístico: domine Agentes de IA, FinOps, Evals, Governança e Spec-Driven Development. Sem hype, com dado real."**

Baseado e conectado oficialmente à base de conhecimento do [Produto com IA](https://www.produtocomia.com.br), sob curadoria do editor **Rodrigo Tozato** (Product Manager · Crédito & Recebíveis).

---

## 🎯 Objetivo da Plataforma

O mercado está saturado de cursos para "Product Managers tradicionais" ensinando cerimônias ágeis e escrita de cards genéricos no Jira. Em paralelo, a inteligência artificial generativa transformou radicalmente a natureza do software:

1. **Do Determinismo para o Probabilismo:** Em software comum, se o teste passou, o código funciona para sempre. Em IA generativa, cada output é uma distribuição estocástica dependente de temperatura, contexto e alinhamento do modelo.
2. **Do Custo Marginal Zero para o FinOps em Tempo Real:** Cada inferência custa dólares. O AI PM precisa dominar custo por tarefa resolvida, roteamento hierárquico e janelas de contexto.
3. **Da Validação de "Olhômetro" para Evals Quantitativos:** Esqueça testar 3 prompts e achar que está pronto. Produtos de IA em produção exigem Golden Datasets, LLM-as-a-Judge e Release Gates inegociáveis.
4. **Da Autonomia Cega para a Governança de Incidentes:** Reversão de código não cancela efeitos externos causados por agentes autônomos no mundo real.

Esta plataforma foi construída especificamente para **capacitar novos PMs e profissionais em migração de carreira** para atuarem com a maturidade técnica e analítica que as maiores empresas do mundo exigem.

---

## 🚀 Módulos da Aplicação

### 1. 🕹️ Simulador Interativo de Cases (Case Arena)
Simulações de cenários empresariais complexos divididos em fases de decisão sequenciais.
- **Painel de Telemetria ao Vivo:** Métricas recalculadas a cada escolha do usuário:
  - **Acurácia / F1-Score (%)**
  - **Custo por Tarefa Concluída ($ USD)**
  - **Latência p95 (ms/s)**
  - **Risco de Governança (Baixo/Médio/Alto/Crítico)**
  - **Confiança do Usuário / CSAT (%)**
- **Análise Técnica Profunda:** Cada decisão apresenta os prós, contras, a lição prática e links diretos para os guias oficiais de referência.
- **Mentor de IA Integrado:** Campo de reflexão aberta com parecer do especialista (100% offline via heurística calibrada ou em tempo real via Gemini 1.5 Flash).
- **Debrief Final & Certificado:** Comparativo visual de métricas Antes vs Depois, lições aprendidas e confetes de conquista.

#### 📚 Cases Práticos Inclusos:
* **`CASE.01` — FinOps & Latência: O Agente de Suporte que Estourou o Budget:** Roteamento semântico de modelos, cache de baixa latência e limites de tool calling em uma Fintech B2B.
* **`CASE.02` — Evals & Gate de Lançamento: O Copiloto de Análise de Risco de Crédito:** Criação de Golden Dataset estratificado, pipelines de LLM-as-a-Judge e Hard Gates de segurança financeira.
* **`CASE.03` — Governança & Incident Response: Agente com Efeito Externo Irreversível:** Gestão de crise de agente com permissão de reembolso bancário, kill-switch de ferramentas e reconciliação externa contábil.
* **`CASE.04` — Discovery & Spec-Driven Development: Da PRD Vaga ao Spec Kit com Coding Agents:** Como guiar squads modernas que usam Cursor, Claude Code e Copilot através de schemas executáveis e contratos JSON.
* **`CASE.05` — Agent Washing vs Valor Real: A Armadilha de Colocar IA em Tudo:** Como desmascarar falsos agentes, resistir à pressão do hype executivo e desenhar interfaces híbridas sem fricção.

---

### 2. 🧭 Trilhas de Transição de Carreira (Migração)
Diagnósticos e planos de ação de 90 dias estruturados para cada ponto de partida:
- **De PM Tradicional para AI-First PM:** Desaprender determinismo e dominar Evals e FinOps.
- **De Engenharia / Tech Lead para AI PM:** Transição do fascínio pelo modelo para a viabilidade econômica e Jobs-to-be-Done.
- **De Dados / Analytics / ML para AI PM:** Sair dos notebooks e modelos preditivos isolados para produtos interativos com UX de IA.
- **De Operações / Negócios para AI PM:** Transformar conhecimento de domínio em automação cognitiva com esteiras de aprovação humana.

---

### 3. 🎯 Radar de Competências (Self-Assessment)
Diagnóstico interativo de habilidades com visualização em **Gráfico de Radar Poligonal dinâmico**:
- *Arquitetura de Modelos & IA*
- *Evals & Gates de Qualidade*
- *FinOps de IA & Unit Economics*
- *Governança, Risco & Incidentes*
- *Spec-Driven Development (SDD)*
- *Discovery Anti-Hype*

---

### 4. 📑 Toolkit de Templates & PRDs Práticas
Documentos em Markdown prontos para uso em squads:
- **Template de PRD para Agentes de IA & LLM Apps:** Schemas, invariantes de negócio e SLOs de latência/custo.
- **Template de Matriz de Evals & Release Gate:** Hard Gates vs Soft Gates e composição de Golden Dataset.
- **Template de Ledger de FinOps:** Fórmulas de Unit Economics e limites de disjuntores orçamentários (Circuit Breakers).
- **Checklist de Incident Response para Agentes de IA:** Protocolo de contenção em 4 passos.

---

### 5. 📖 Hub de Guias Oficiais Conectados
Acesso direto aos artigos de referência com destaques conceituais e links para `https://www.produtocomia.com.br/guias/`.

---

## 🛠️ Tecnologias Utilizadas

- **React 19 & TypeScript:** Tipagem estrita com schemas formais de simulação.
- **Vite:** Empacotamento ultrarrápido com hot-reload.
- **Tailwind CSS:** Design system responsivo, tipografia editorial moderna e tema dark técnico.
- **Lucide Icons:** Iconografia técnica e minimalista.
- **Canvas Confetti:** Feedback visual de conclusão de cases.
- **Google Gemini API (Opcional):** Suporte opcional a feedback generativo em tempo real via Gemini 1.5 Flash.

---

## 💻 Como Rodar o Projeto

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Para gerar a build de produção:
```bash
npm run build
```

4. Para pré-visualizar a build de produção:
```bash
npm run preview
```

---

## 👤 Créditos & Autoria

- **Plataforma:** Produto com IA — Labs & Case Arena
- **Autor / Editor de Conteúdo:** [Rodrigo Tozato](https://www.produtocomia.com.br/sobre)
- **Portal Principal:** [www.produtocomia.com.br](https://www.produtocomia.com.br)
