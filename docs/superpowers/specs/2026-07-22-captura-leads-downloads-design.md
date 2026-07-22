# Captura leve de leads em downloads — especificação de design

**Data:** 22 de julho de 2026

**Projeto:** Produto com IA

**Status:** desenho aprovado pelo responsável do site

## 1. Objetivo

Transformar todo download do site em uma oportunidade de relacionamento sem prejudicar a experiência, a indexação das páginas ou a presença do Produto com IA em respostas de mecanismos de busca e sistemas de inteligência artificial.

O sistema deve:

- solicitar o mínimo de informação antes do primeiro download;
- liberar o arquivo imediatamente após uma submissão válida;
- reconhecer o mesmo visitante em downloads posteriores no mesmo navegador;
- registrar cada material baixado;
- enviar uma notificação para `rodrigo.tozato@icloud.com`;
- preservar uma cópia durável dos leads e eventos de download;
- evitar spam, automação abusiva e exposição de dados pessoais;
- não usar o consentimento para comunicações como condição para liberar o material.

## 2. Decisões de produto

### 2.1 Primeiro download

Ao selecionar um material, a pessoa verá uma janela compacta sobre a página atual. A janela terá:

- título direto: “Receba o material gratuito”;
- uma frase explicando que o arquivo será liberado imediatamente;
- campo obrigatório de e-mail;
- caixa opcional e desmarcada para receber novidades do Produto com IA;
- texto curto de privacidade com link para a política completa;
- botão com o nome da ação, por exemplo “Baixar o material”.

Não será solicitado nome, telefone, empresa, cargo ou senha. O objetivo é reduzir atrito e coletar somente o dado necessário.

Após uma submissão aceita, o download começará automaticamente na mesma página. Não haverá confirmação por e-mail nem necessidade de abrir outra aba.

### 2.2 Downloads posteriores

O servidor criará um identificador aleatório em cookie seguro, `HttpOnly`, `Secure` e `SameSite=Lax`. Esse identificador não conterá o e-mail.

Enquanto o identificador for válido no mesmo navegador:

- o formulário não será exibido novamente;
- o novo download será registrado para o lead já conhecido;
- o arquivo será liberado diretamente;
- uma nova notificação poderá indicar o material adicional baixado.

Se o cookie tiver sido removido, expirado ou usado em outro navegador, o formulário será apresentado novamente.

### 2.3 Comunicação opcional

O aceite para receber novidades será separado, opcional e desmarcado. A ausência de aceite nunca bloqueará o arquivo.

O e-mail enviado ao responsável informará claramente:

- `Autorizou novidades: sim`; ou
- `Autorizou novidades: não`.

Nenhum lead será inscrito automaticamente em newsletter ou ferramenta de marketing nesta fase.

## 3. Arquitetura recomendada

O site continuará sendo gerado pelo Astro e servido pelo nginx. Será acrescentado um serviço pequeno e isolado para leads e downloads, executado no mesmo servidor por contêiner.

### 3.1 Componentes

1. **Interface no site:** componente único, bilíngue e acessível que intercepta os links dos materiais.
2. **API própria:** recebe a submissão, valida os dados e controla o acesso aos arquivos.
3. **Armazenamento durável:** banco SQLite em volume persistente, com leads e eventos separados.
4. **Entrega de arquivos:** os materiais deixam de ser servidos como arquivos públicos diretos e passam a ser entregues pela API após autorização.
5. **Notificação:** integração com Resend para enviar mensagens a `rodrigo.tozato@icloud.com`.
6. **Proteção contra abuso:** Cloudflare Turnstile no modo de menor atrito, validado no servidor, além de honeypot, limites de requisição e validação de origem.

### 3.2 Rotas

- `POST /api/download-leads/register`: registra o primeiro download, cria ou atualiza o lead, registra o consentimento e devolve autorização de curta duração.
- `POST /api/download-leads/authorize`: reconhece um visitante já identificado e cria autorização para um novo material.
- `GET /api/download-leads/file/:token`: valida a autorização descartável e transmite somente o arquivo associado ao token.
- `GET /api/download-leads/health`: usado apenas para verificar a saúde do serviço durante publicação e monitoramento.

Os tokens de arquivo serão aleatórios, terão validade curta, estarão ligados a um único material e não poderão ser reutilizados indefinidamente.

### 3.3 Arquivos protegidos

Os arquivos deixarão a pasta pública do site. No processo de publicação, serão copiados para um volume privado acessível apenas pelo serviço de downloads.

O servidor manterá uma lista explícita dos materiais permitidos. Caminhos enviados pelo navegador nunca serão usados diretamente para acessar o sistema de arquivos. Isso impede travessia de diretórios e solicitação de arquivos internos.

## 4. Dados armazenados

### 4.1 Lead

- identificador interno aleatório;
- e-mail normalizado;
- estado do consentimento para novidades;
- data do primeiro registro;
- data da última atividade;
- versão do aviso de privacidade aceito.

### 4.2 Evento de download

- identificador do lead;
- identificador do material;
- data e hora;
- página de origem;
- parâmetros de campanha permitidos, quando existirem;
- idioma da página;
- resultado da notificação por e-mail.

O endereço IP completo e o agente de usuário completo não serão armazenados como dados de marketing. Informações mínimas e temporárias poderão ser usadas em memória para proteção contra abuso.

## 5. Privacidade e segurança

Será criada uma política de privacidade em português e inglês explicando:

- quem controla os dados;
- quais dados são coletados;
- finalidade da coleta;
- fornecedores envolvidos;
- período de retenção;
- como solicitar acesso, correção ou exclusão;
- como retirar a autorização para novidades;
- uso do Cloudflare Turnstile.

O projeto seguirá os princípios de finalidade, necessidade, transparência e segurança. A versão do aviso mostrada no formulário será registrada com a submissão.

Controles obrigatórios:

- chaves e credenciais somente em variáveis protegidas no servidor;
- nenhuma credencial incluída no repositório ou no navegador;
- criptografia HTTPS em todo o fluxo;
- validação de e-mail, limites de tamanho e escape de conteúdo;
- consulta parametrizada no banco;
- Turnstile validado no servidor;
- honeypot silencioso;
- limite por origem de rede e por janela de tempo;
- mensagens de erro sem detalhes internos;
- cópia persistente do lead antes de depender da notificação por e-mail;
- rotina de backup e exportação do banco;
- retenção definida e possibilidade de exclusão de um lead.

## 6. E-mails enviados ao responsável

O remetente será um subdomínio dedicado, preferencialmente `leads.produtocomia.com.br`, para não interferir no recebimento atual pelo iCloud.

Assunto sugerido:

`Novo download: <nome do material>`

Conteúdo:

- e-mail do lead;
- material baixado;
- página de origem;
- idioma;
- campanha, quando disponível;
- data e hora no fuso de São Paulo;
- autorização para novidades;
- indicação de primeiro lead ou download adicional.

O envio usará chave de idempotência para reduzir notificações duplicadas. Falhas de envio ficarão registradas para nova tentativa, sem impedir a entrega do arquivo ao visitante após o lead ter sido salvo.

## 7. Analytics e conversão

Eventos serão enviados ao sistema de analytics já instalado, sem nome ou e-mail:

- `download_gate_opened`;
- `download_lead_submitted`;
- `download_authorized_returning_lead`;
- `download_started`;
- `download_failed`;
- `download_marketing_opt_in`.

Propriedades permitidas:

- identificador público do material;
- idioma;
- página de origem;
- campanha;
- visitante novo ou reconhecido.

Métricas principais:

- cliques em materiais;
- taxa de abertura do formulário;
- taxa de submissão;
- taxa de início efetivo do download;
- consentimentos opcionais;
- falhas por etapa;
- materiais com maior geração de leads.

## 8. SEO e presença em respostas de IA

As páginas dos guias, relatórios, checklists e templates continuarão públicas, indexáveis e com conteúdo suficiente para mecanismos de busca e sistemas de IA compreenderem e citarem o material.

O bloqueio será aplicado somente ao arquivo final para download. Não serão adicionados `noindex`, bloqueios no `robots.txt` ou restrições aos conteúdos editoriais.

Cada material manterá:

- título e descrição visíveis na página;
- autoria, data, versão e metodologia quando aplicável;
- referências e dados estruturados já existentes;
- alternativa textual ou resumo substancial na página pública.

Assim, a captação de leads não transforma o conteúdo editorial em uma área fechada e não remove as páginas do ecossistema de descoberta.

## 9. Acessibilidade e experiência

A janela deverá:

- funcionar com teclado e leitor de tela;
- mover o foco para o formulário ao abrir;
- manter o foco dentro da janela enquanto estiver aberta;
- fechar com `Esc` e botão claramente identificado;
- devolver o foco ao link de origem ao fechar;
- exibir validação junto ao campo;
- respeitar preferência por movimento reduzido;
- funcionar em telas pequenas sem rolagem lateral;
- usar os estilos e o tom visual atuais do site;
- oferecer textos em português e inglês conforme a página.

Se JavaScript estiver indisponível, o link levará a uma página simples de solicitação do material, mantendo o fluxo funcional.

## 10. Falhas e recuperação

- Se o e-mail de notificação falhar, o lead permanece salvo, o arquivo é liberado e o envio entra em nova tentativa.
- Se o banco não puder salvar, o arquivo não é liberado e a pessoa recebe uma mensagem curta para tentar novamente.
- Se o Turnstile não responder por indisponibilidade temporária, o sistema poderá usar controles locais mais restritos sem expor o arquivo diretamente.
- Se a API estiver indisponível, a página permanece navegável e os conteúdos editoriais continuam acessíveis.
- A publicação terá verificação de saúde e reversão automática em caso de falha.

## 11. Validação e critérios de aceite

A funcionalidade estará pronta quando:

1. todos os links atuais em `/downloads/` passarem pela jornada;
2. links adicionados futuramente pelo componente de materiais usarem a jornada automaticamente;
3. o primeiro download exigir somente e-mail válido;
4. o arquivo for iniciado imediatamente após o registro;
5. downloads posteriores no mesmo navegador não repetirem o formulário;
6. cada evento aparecer no armazenamento e gerar notificação;
7. o aceite de novidades for opcional, desmarcado e registrado;
8. acessos diretos aos arquivos protegidos não contornarem a captura;
9. nenhum dado pessoal aparecer no analytics, HTML, URL ou logs públicos;
10. o fluxo funcionar em português e inglês, desktop e celular;
11. testes automatizados cobrirem validação, autorização, expiração, abuso e falhas de e-mail;
12. o build, a auditoria do site e os testes de publicação continuarem aprovados;
13. as páginas públicas permanecerem indexáveis e presentes no sitemap;
14. a política de privacidade estiver publicada e vinculada no formulário e no rodapé.

## 12. Dependências externas e participação do responsável

A implementação pode ser preparada integralmente no código e no servidor. Para ativar o envio real, o responsável precisará apenas:

1. criar ou acessar uma conta no Resend;
2. autorizar os registros DNS do subdomínio de envio no Cloudflare;
3. fornecer a chave do serviço por canal seguro para instalação no servidor;
4. confirmar o recebimento de um e-mail de teste.

Essas ações serão apresentadas em instruções simples no momento adequado. Nenhuma senha pessoal ou credencial será incluída no repositório.

## 13. Fora do escopo desta fase

- campanhas automáticas de e-mail;
- importação automática para CRM;
- pontuação de leads;
- enriquecimento de dados pessoais;
- venda ou compartilhamento de contatos;
- exigência de telefone, empresa ou cargo;
- painel administrativo público.

Essas capacidades poderão ser avaliadas depois que houver dados reais de conversão e necessidade comprovada.
