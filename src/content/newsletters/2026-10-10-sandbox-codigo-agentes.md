---
title: "Antes de soltar um agente: onde o código vai rodar?"
date: "2026-10-10"
seoSlug: "sandbox-agentes-ia"
excerpt: "A segurança de agentes de IA também depende de onde o código gerado é executado: isolamento, permissões e limites ajudam a conter falhas."
tags: ["inteligencia-artificial", "produto", "agentes-de-ia", "governanca-de-ia"]
featured: true
draft: false
---

Quando um agente executa código que acabou de gerar, a pergunta de segurança não é só “e se ele errar?”. Também importa onde esse erro acontece e o que o código pode alcançar.

Agentes que analisam planilhas, montam relatórios ou automatizam uma rotina podem escrever pequenos trechos de código e executá-los durante o trabalho. Se esse código roda solto no ambiente da empresa, uma falha pode alcançar recursos fora da tarefa. Em uma sandbox isolada, com limites claros de acesso, o impacto fica contido e o time ganha mais confiança para avançar.

## Sandbox para agentes de IA: o ambiente de execução

Foi isso que me chamou atenção no [MXC, projeto que a Microsoft publicou como código aberto](https://github.com/microsoft/mxc). Ele oferece um sistema de sandbox para executar código não confiável, como saídas de modelos, plugins e ferramentas. O projeto funciona em Windows, Linux e macOS e oferece diferentes níveis de isolamento, da sandbox nativa do sistema operacional até máquinas virtuais.

## Segurança também faz parte da experiência do agente

Do lado de produto, leio esse movimento como sinal de maturidade. A conversa sobre agentes está saindo do “o que dá para fazer?” e indo para “como fazer com segurança e em escala?”.

Isso muda o desenho das funcionalidades. Permissões, trilha de auditoria e limites de ação passam a fazer parte da experiência, em vez de aparecerem como um adendo no fim do projeto. O [guia de agentes de IA](/guias/agentes-de-ia/) ajuda a pensar sobre autonomia; a [governança de IA](/guias/governanca-de-ia/) conecta responsabilidade e controles ao produto. A [matriz de risco de IA](/guias/matriz-risco-ia/) também pode apoiar a avaliação de cada caso.

## Uma pergunta para o roadmap

Vejo esse avanço com otimismo. Quanto mais fácil for criar uma camada de contenção, mais áreas conservadoras, como finanças, conseguem colocar automação inteligente para trabalhar sem abrir mão de controle. Essa decisão também faz parte da [gestão de produtos com IA](/guias/gestao-de-produtos-com-ia/).

Se você está pensando em agentes no roadmap, vale começar por uma pergunta concreta: onde o código vai rodar?

Para conhecer o projeto que inspirou essa reflexão, [veja o MXC no GitHub](https://github.com/microsoft/mxc).

### O resto do radar

- **DeepSeek 4.1 Flash** — modelos baratos e “bons o bastante” podem mudar a conta de custo e o pricing de funcionalidades de IA. [Leia a análise](https://www.dgt.is/blog/2026-10-07-deepseek-freek-out/).
- **Step 5 Preview (StepFun)** — um modelo agêntico com contexto de 1 milhão de tokens e preço agressivo amplia as opções de fornecedor e custo. [Veja no OpenRouter](https://openrouter.ai/stepfun/step-5-preview).
- **Whistle (Cactus)** — voz totalmente on-device, em 16,9 MB, abre espaço para funcionalidades offline, mais privadas e sem custo de API por uso. [Conheça o Whistle](https://cactuscompute.com/blog/whistle).
- **Deno entra na Cloudflare** — quem usa Deno Deploy precisa planejar uma migração; a Cloudflare reforça a aposta em infraestrutura para agentes. [Leia o anúncio](https://deno.com/blog/cloudflare).
- **bigarrow** — um exemplo de UX de agentes que orienta a pessoa em etapas que exigem participação humana, sem assumir o controle da tela. [Veja no GitHub](https://github.com/franzenzenhofer/big-arrow-on-the-screen).
- **Planeta descoberto com Claude Code** — um caso de uso de assistente de programação por uma pessoa não especialista pode sinalizar novos segmentos e jobs-to-be-done (afirmação não verificada). [Veja a publicação no Reddit](https://www.reddit.com/r/ClaudeAI/s/mbe5IY2LF9).

Por hoje é isso. Amanhã tem mais.
