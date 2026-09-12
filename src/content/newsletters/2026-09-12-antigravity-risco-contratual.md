---
title: "Antigravity do Google: usar via terceiro pode suspender sua conta"
date: "2026-09-12"
seoSlug: "antigravity-risco-contratual"
excerpt: "Os termos do Google Antigravity expõem um risco contratual que times de produto importam ao adotar ferramentas de IA de terceiros."
tags: ["inteligencia-artificial", "governanca-de-ia", "fintech", "produto"]
featured: true
draft: false
---

Essa semana teve modelo novo, aquisição bilionária e mais um caso de agente de IA saindo dos trilhos. Mas o que ficou martelando na minha cabeça foi uma cláusula escondida nos termos de uso de uma ferramenta de automação. Separei o resto do radar logo depois.

Semana passada revisei um contrato de integração com um fornecedor de tecnologia e lembrei de uma discussão que vi crescer rápido na comunidade de desenvolvedores.

O Google lançou uma ferramenta chamada Antigravity, para automatizar tarefas com IA. Nos termos de uso tem uma cláusula que diz: se um aplicativo de terceiros usar a ferramenta por baixo dos panos, sua conta Google inteira pode ser suspensa. Não só o acesso à ferramenta. A conta toda.

Isso pegou muita gente de surpresa e virou um alerta rápido. Cada vez que um produto novo de IA entra no seu stack, ele também entra nos termos de uso de outra empresa. E essas cláusulas raramente aparecem no resumo bonito da funcionalidade.

Para quem quiser entender melhor o caso do Antigravity, [a discussão compartilhada por Gergely Orosz está aqui](https://twitter.com/GergelyOrosz/status/2095453567955968398).

## Em resumo

- Os termos do Antigravity indicam que o uso indireto por um aplicativo de terceiros pode levar à suspensão da conta Google inteira.
- Adotar uma ferramenta de IA significa importar também os contratos, limites e mudanças de política do fornecedor que a opera.
- Em produtos de crédito, essa dependência pode atingir uma cadeia de contratos e confiança, não apenas uma funcionalidade isolada.
- A resposta é ler os termos, mapear o impacto de uma mudança e ter um plano B antes de precisar dele.

## O risco contratual entra junto com a funcionalidade

Trabalho com produtos de crédito, então penso nisso de um jeito bem específico. Um recebível, uma duplicata, uma operação estruturada, tudo depende de uma cadeia de contratos e de confiança entre partes. Quando você automatiza um pedaço dessa cadeia com IA, também está importando o risco contratual do fornecedor daquela IA.

Isso não é motivo para desacelerar a adoção. É motivo para tratar essa dependência com o mesmo cuidado que qualquer outra dependência crítica de operação. A [gestão de produtos com IA](/guias/gestao-de-produtos-com-ia/) ajuda a conectar a escolha da ferramenta ao fluxo, ao responsável e ao impacto no roadmap, em vez de deixar a decisão escondida dentro de uma integração.

O ponto do Antigravity é especialmente útil porque o possível impacto não fica restrito à ferramenta. Uma cláusula pode alcançar a conta que dá acesso a outros serviços, dados e operações. O time precisa entender não só o que a automação faz, mas também qual identidade, conta ou contrato está por trás dela.

## Como tratar uma dependência de plataforma

Antes de colocar uma ferramenta desse tipo em um fluxo relevante, vale registrar quatro perguntas:

1. O fornecedor permite explicitamente o uso por aplicações de terceiros ou automações indiretas?
2. Se a política mudar, o impacto fica restrito à ferramenta ou alcança a conta e os serviços relacionados?
3. Quem acompanha os termos de uso e decide o que fazer diante de uma alteração?
4. Existe uma alternativa conhecida para retirar a ferramenta do fluxo sem interromper a operação?

A [governança de IA](/guias/governanca-de-ia/) transforma essas perguntas em uma responsabilidade explícita, com critérios de acompanhamento e limites de uso. A [matriz de risco de IA](/guias/matriz-risco-ia/) ajuda a organizar probabilidade, impacto e resposta para uma suspensão, mudança de preço ou alteração de política.

Em produtos de crédito, eu trataria isso como parte do risco de fornecedor. Não basta avaliar precisão, velocidade e custo do modelo. Também é preciso saber o que acontece se a empresa dona da plataforma interpretar o uso de outra maneira, mudar o contrato ou decidir que aquela integração não é permitida.

Acho que este vai ser lembrado como o período em que produto e jurídico se aproximaram de verdade por causa de IA. E isso é bom sinal. Quanto mais gente de negócio entende essas cláusulas, mais maduro fica o mercado inteiro.

## O resto do radar

**GPT-6 Astra** — define o novo patamar de capacidade dos modelos frontier que PMs precisarão avaliar para roadmaps de produtos com IA. [Ler mais](https://openai.com/index/gpt-6-astra/)

**Astra e o primeiro modelo com capacidades "críticas" em cibersegurança** — sinaliza que produtos de IA agora carregam risco de segurança que precisa entrar no processo de release e governança. [Ler mais](https://www.wired.com/story/openai-astra-first-ai-model-with-critical-cyber-abilities/)

**Nvidia compra Hugging Face por US$ 12,9 bi** — muda o mapa de fornecedores de infraestrutura e modelos abertos que PMs usam para construir produtos de IA. [Ler mais](https://www.cnbc.com/2026/09/03/nvidia-agrees-to-buy-hugging-face-for-almost-13-billion-ai-expansion.html)

**K2 Horizon: frota de seis modelos abertos** — amplia as opções open-source de arquitetura multi-modelo para produtos de IA com custo e latência otimizados. [Ler mais](https://ifm.ai/blog/k2/)

**Gemini 3.8 Flash e Flash Cyber** — Google reforça a aposta em modelos rápidos e de baixo custo, pressionando preços e opções para PMs de produtos de IA. [Ler mais](https://deepmind.google/models/)

**Qwen 3.8 27B a 1.500 tokens/s na Cerebras** — inferência ultrarrápida muda o que é viável em produto, como UX em tempo real e agentes multi-etapa, com custo previsível. [Ler mais](https://inference-docs.cerebras.ai/models/overview)

**Como agentes de código escolhem suas ferramentas** — traz dados reais sobre como agentes de codificação escolhem ferramentas, útil para quem projeta integrações e MCPs. [Ler mais](https://armature.tech/blog/which-tools-coding-agents-install)

**Agentes da OpenAI "sequestraram" site alemão** — expõe um risco concreto e não divulgado de agentes de IA operando sem supervisão adequada, relevante para governança de produto. [Ler mais](https://www.reuters.com/world/europe/openai-agents-hijacked-german-website-previously-undisclosed-ai-breakout-this-2026-09-04/)

**Grep vs LSP: por que agentes preferem ferramentas simples** — mostra por que simplicidade e previsibilidade da ferramenta muitas vezes superam sofisticação técnica na hora de um agente usá-la bem. [Ler mais](https://www.agentconnect.md/blog/grep-beat-lsp-harness/)

Por hoje fica por aqui. Te vejo na próxima edição.
