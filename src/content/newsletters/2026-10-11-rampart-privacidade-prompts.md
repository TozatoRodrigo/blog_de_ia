---
title: "Rampart mascara dados pessoais antes do prompt sair"
date: "2026-10-11"
seoSlug: "rampart-privacidade-prompts"
excerpt: "Rampart mascara dados pessoais localmente antes da mensagem chegar ao chatbot e mostra como privacidade por design pode reduzir atritos com segurança e compliance."
tags: ["inteligencia-artificial", "produto", "governanca-de-ia", "seguranca-de-ia", "fintech"]
featured: true
draft: false
---

A pergunta que aparece nas minhas leituras e nas reuniões de produto é simples: o que acontece com os dados quando alguém cola algo num chatbot? Encontrei uma ferramenta que enfrenta esse ponto diretamente, além de seis itens do radar.

Em empresas, muitas conversas sobre IA acabam na mesma pergunta: “mas e os dados?”. A equipe quer ganhar tempo com um chatbot, enquanto segurança e compliance tentam entender o que vai para o prompt: nome de cliente, CPF, cartão, endereço. Às vezes, basta um copia e cola distraído.

## Privacidade em prompts de IA começa antes do envio

Foi por isso que me chamou atenção o Rampart, uma ferramenta open source ainda em alpha. Ela mascara dados pessoais da mensagem antes de ela sair do navegador. Tudo acontece no próprio dispositivo, em milissegundos. Dados estruturados, como cartão e documentos, são identificados por regras; nomes e endereços ficam a cargo de um modelo pequeno que também roda localmente. [Leia a apresentação do Rampart](https://ndstudio.gov/posts/say-hello-to-rampart).

O que eu acho mais interessante é o raciocínio por trás. Em vez de pedir para a pessoa “tomar cuidado”, a proteção entra no caminho natural do uso. Ela escreve como sempre escreveu, e o produto cuida do resto antes de enviar a mensagem.

## Privacidade por design pode destravar a adoção

Esse é o tipo de decisão que cabe a quem pensa produto. Quando a privacidade fica para o fim do projeto, pode virar uma barreira jurídica. Quando entra na experiência desde o começo, pode reduzir a fricção com compliance, aumentar a confiança de quem usa e ajudar a adoção a sair do comitê.

Em setores regulados, como o financeiro, isso pode ser a diferença entre uma funcionalidade de IA que fica no piloto e outra que chega em escala. Sou otimista com esse caminho: quanto mais a proteção vem embutida, mais espaço sobra para explorar o que a IA tem de bom. Essa escolha se conecta à [governança de IA](/guias/governanca-de-ia/), à [gestão de produtos com IA](/guias/gestao-de-produtos-com-ia/) e à avaliação de riscos com a [matriz de risco de IA](/guias/matriz-risco-ia/).

### O resto do radar

- **Microsoft MXC 1.0.0** — o isolamento de agentes vira requisito de plataforma e muda o que dá para prometer em segurança e confiança. [Leia o anúncio](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/).
- **Talorys, agente pessoal self-hosted na Cloudflare** — mostra uma arquitetura mínima de assistente com memória e rotinas, com custo quase zero para prototipar. [Veja no GitHub](https://github.com/rociiu/talorys).
- **Epoch AI: InnovationEval** — calibra expectativas sobre a autonomia de agentes em P&D e a necessidade de revisão humana nos fluxos. [Leia o estudo](https://epoch.ai/publications/innovationeval).
- **Nvidia negocia a compra da Reflection AI** — a consolidação em torno de modelos abertos muda a conta de build vs. buy e o risco de dependência de fornecedor. [Leia a reportagem](https://www.ft.com/content/052610c5-22b4-4dd4-932e-b7f9f0628b6a).
- **Como monetizar funcionalidades de IA** — o custo variável de inferência exige repensar pricing, bundling e margem antes do lançamento. [Leia a análise de Lenny](https://lennysnewsletter.com/p/how-should-you-monetize-your-ai-features).
- **Pricing de produtos de IA, pela Stripe** — compara modelos de cobrança por assinatura, uso e resultado com casos reais para embasar a decisão. [Veja o guia](https://stripe.com/fr-ca/guides/pricing-ai-products-lessons-from-leading-ai-companies).

Fico por aqui. Amanhã tem mais um recorte do que vale a atenção de quem faz produto.
