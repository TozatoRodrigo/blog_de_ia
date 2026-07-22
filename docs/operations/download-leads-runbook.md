# Operação da captura de leads em downloads

Este guia cobre a ativação e a manutenção do serviço que entrega materiais do Produto com IA. Ele não contém chaves reais. O responsável operacional e de privacidade é Rodrigo Tozato, pelo e-mail `rodrigo.tozato@icloud.com`.

## Resend

1. Entre ou crie a conta usada pelo Produto com IA no Resend.
2. Adicione o domínio de envio `leads.produtocomia.com.br`.
3. Copie para o DNS da zona `produtocomia.com.br`, no Cloudflare, exatamente os registros SPF e DKIM apresentados pelo Resend. Se o painel informar um registro adicional de retorno, adicione-o também.
4. Aguarde o domínio aparecer como verificado antes de continuar.
5. Crie uma chave de API exclusiva, apenas para envio, e guarde-a no gerenciador de senhas. Ela será usada somente como `RESEND_API_KEY` no servidor.
6. Configure `RESEND_FROM` com um remetente do domínio verificado, por exemplo `Produto com IA <downloads@leads.produtocomia.com.br>`.

Revogue uma chave antiga depois de confirmar que a nova envia corretamente. Chaves do Resend nunca entram no Git, no arquivo público do site ou em capturas de tela.

## Cloudflare Turnstile

1. No painel Cloudflare correto, abra Turnstile e crie o widget `Produto com IA — downloads`.
2. Permita somente o host `produtocomia.com.br`.
3. Escolha o modo **Managed**. A interface do site usa a aparência `interaction-only` para reduzir atrito.
4. Copie separadamente a chave pública e a secreta. A pública vai em `TURNSTILE_SITE_KEY`; a secreta vai em `TURNSTILE_SECRET_KEY`, somente no servidor.
5. Antes dos valores de produção, rode os testes com as chaves de teste oficiais “always pass” do Cloudflare. Não misture chaves de teste e produção.

## Variáveis do servidor

O arquivo real fica em `/home/rodrigo/apps/radar-ia/.env.download-leads`. Comece a partir de `deploy/download-leads.env.example`, preencha os valores no próprio servidor e nunca envie esse arquivo pelo processo de publicação.

Gere o segredo da sessão no servidor:

```sh
openssl rand -hex 32
```

Preencha `COOKIE_SECRET`, as duas chaves Turnstile, `RESEND_API_KEY` e o remetente verificado. Mantenha `LEAD_NOTIFICATION_TO=rodrigo.tozato@icloud.com`, `ALLOWED_ORIGIN=https://produtocomia.com.br` e os caminhos do exemplo. Proteja o arquivo:

```sh
chmod 600 /home/rodrigo/apps/radar-ia/.env.download-leads
```

O diretório persistente `lead-data` deve ter modo 700. Os materiais ficam em `private-downloads`; nunca copie downloads diretamente para `html` ou qualquer pasta pública do nginx.

## Teste de aceitação

Depois que as variáveis estiverem prontas, publique com `./scripts/deploy.sh`. O publicador já verifica site, API, privacidade, arquivos privados e possibilidade de retorno à versão anterior. Em seguida:

1. Abra uma janela privativa e uma página de guia com material.
2. Clique no download e confirme que o formulário abre, a opção de novidades começa desmarcada e o texto de privacidade está visível.
3. Use um endereço controlado, conclua o Turnstile e confirme que o arquivo começa imediatamente.
4. Confirme a notificação em `rodrigo.tozato@icloud.com` com material, origem e horário corretos.
5. Baixe um segundo material: ele deve começar sem pedir o e-mail novamente.
6. Nas métricas, confirme apenas `material_id`, idioma, página de origem e indicação de visitante recorrente. Nenhum e-mail pode aparecer na URL ou no painel de analytics.
7. Execute um pedido de exclusão com o endereço de teste e confirme que sessões e eventos também desapareceram.

## Exportar leads

Exporte somente quando houver finalidade definida e somente os campos necessários. No servidor, crie antes um diretório protegido fora de `html`:

```sh
mkdir -p /home/rodrigo/apps/radar-ia/protected-exports
chmod 700 /home/rodrigo/apps/radar-ia/protected-exports
cd /home/rodrigo/apps/radar-ia
docker compose exec -T download-leads node --input-type=module -e 'import { DatabaseSync } from "node:sqlite"; const db = new DatabaseSync("/data/leads.sqlite", { readOnly: true }); process.stdout.write(JSON.stringify(db.prepare("SELECT email, marketing_opt_in, created_at, updated_at FROM leads ORDER BY updated_at DESC").all())); db.close();' > protected-exports/leads.json
chmod 600 protected-exports/leads.json
```

Transfira uma cópia apenas por canal protegido, cifre cópias fora do servidor e apague-as quando a finalidade terminar. Não exporte tokens, autorizações ou identificadores internos.

## Excluir um lead

Confirme o pedido usando o mesmo e-mail do cadastro. Revise o endereço normalizado antes de executar. A remoção abaixo usa o método de manutenção do serviço; as relações do banco apagam em cascata as sessões, os eventos e as autorizações vinculadas:

```sh
cd /home/rodrigo/apps/radar-ia
docker compose exec -T download-leads node --input-type=module -e 'import { createLeadDatabase } from "./src/database.mjs"; import { normalizeEmail } from "./src/security.mjs"; const email = normalizeEmail(process.argv[1]); const db = createLeadDatabase({ path: "/data/leads.sqlite" }); const deleted = db.deleteLeadByEmail(email); db.close(); process.stdout.write(deleted ? "deleted\n" : "not-found\n");' -- pessoa@example.com
```

Registre fora do banco de leads a data do atendimento e o resultado, sem manter dados além do necessário.

## Backup

O banco SQLite aceita backup consistente com o serviço no ar. Crie o destino dentro do volume persistente e use o método da aplicação:

```sh
cd /home/rodrigo/apps/radar-ia
mkdir -p lead-data/backups
chmod 700 lead-data/backups
docker compose exec -T download-leads node --input-type=module -e 'import { createLeadDatabase } from "./src/database.mjs"; const db = createLeadDatabase({ path: "/data/leads.sqlite" }); await db.backup("/data/backups/leads-manual.sqlite"); db.close();'
```

Verifique se o arquivo existe e tem tamanho maior que zero. Cópias fora do servidor devem ser cifradas e ter acesso restrito. O publicador preserva `lead-data` entre versões e nunca o remove no rollback.

## Restauração

Escolha um backup confirmado, pare apenas o serviço de leads, preserve o banco atual com outro nome e restaure a cópia. Não substitua um banco enquanto o serviço estiver escrevendo nele.

```sh
cd /home/rodrigo/apps/radar-ia
docker compose stop download-leads
mv lead-data/leads.sqlite lead-data/leads-before-restore.sqlite
cp lead-data/backups/leads-manual.sqlite lead-data/leads.sqlite
docker compose up -d download-leads
docker compose exec -T download-leads wget -q -O /dev/null http://127.0.0.1:8787/api/download-leads/health
```

Se a verificação falhar, pare o serviço, preserve o arquivo restaurado para diagnóstico e devolva `leads-before-restore.sqlite` ao nome original.

## Rotação de chaves

- **Resend:** crie uma nova chave, atualize `RESEND_API_KEY`, reinicie o serviço, faça um envio controlado e só então revogue a anterior.
- **Turnstile:** gere ou substitua o par no Cloudflare, atualize as duas variáveis juntas, reinicie e valide um cadastro.
- **Cookie:** gere outro `COOKIE_SECRET` com `openssl rand -hex 32`. A troca encerra o reconhecimento dos visitantes anteriores; eles informarão o e-mail novamente, sem perder os registros existentes.

Após cada alteração, mantenha o arquivo com modo 600, use `docker compose up -d --build` e repita o teste de aceitação.

## Incidente de segurança

1. Restrinja temporariamente a rota de cadastro no nginx ou pare `download-leads`, mantendo o conteúdo editorial disponível.
2. Preserve os logs relevantes, uma cópia consistente do banco e a linha do tempo. Não publique esses artefatos.
3. Revogue e troque chaves potencialmente expostas; trate a troca do cookie como encerramento de todas as sessões.
4. Determine quais dados e pessoas podem ter sido afetados, a duração e as medidas já tomadas.
5. Avalie, com orientação adequada, as obrigações de comunicação a titulares e à ANPD. Não presuma automaticamente que todo evento exige ou dispensa notificação.
6. Corrija a causa, restaure uma versão limpa, execute os testes e só então reabra os cadastros.

