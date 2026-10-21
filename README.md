# TaskFlow · Service Management

Sistema de gestão de chamados com React, TypeScript e Firebase, tema claro/escuro, categorias por atendente, dashboard, relatórios e ambiente de demonstração público.

## 1. Executar no VS Code

**Requisitos:** Node.js 20+ e npm.

```bash
npm install
cp .env.example .env
npm run dev
```

No Windows PowerShell use `Copy-Item .env.example .env`.

Abra o endereço exibido pelo Vite (normalmente http://localhost:5173).

**Teste imediatamente com o botão “Explorar demonstração”**. Funciona sem banco configurado. A demo tem três perfis, 12 categorias e 45 chamados fictícios. Os dados simulados são salvos em `sessionStorage`, isolados por aba. Use o seletor superior para alternar entre administrador, atendente e solicitante; clique no botão circular para reiniciar. A navegação no modo demo não executa operações no Firebase.

## 2. Preparar o Firebase real

Projeto Firebase: `taskflow-7d1cf` (configuração web incluída no `.env.example`).

1. Confirme **Authentication > Sign-in method > E-mail/Senha** habilitado.
2. Crie **Firestore Database** em modo de produção na região desejada, se ainda não criado.
3. No Firebase Console, em **Authentication > Settings > Authorized domains**, autorize seu domínio usado em produção.
4. Instale o Firebase CLI e faça login:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes --project taskflow-7d1cf
```

**Atenção:** `firebase deploy` publica regras e índices neste projeto. Se já usa Firestore com outras coleções/regras, faça merge com cuidado; as regras deste projeto negam acesso a qualquer coleção fora de `/companies/main`.

### Primeiro administrador e primeira empresa

O registro inicial **não é público**, por segurança. Para criar a empresa e o primeiro administrador:

1. Firebase Console > Configurações do projeto > Contas de serviço > **Gerar nova chave privada**.
2. Salve o JSON no seu computador com o nome `service-account.json` na pasta do projeto. **Nunca suba esse arquivo ao GitHub, envie a ninguém ou use no frontend.** `.gitignore` o exclui.
3. Execute:

```bash
node scripts/bootstrap.mjs service-account.json admin@suaempresa.com.br "UmaSenhaForte123!" "Minha Empresa"
```

O script cria `/companies/main`, 12 categorias e o primeiro usuário `admin`, caso a empresa ainda não exista. Não sobrescreve workspace existente. Você poderá mudar o nome e a cor da empresa em Configurações.

**Atenção:** escolha uma senha forte; em um ambiente de produção real, evite passar senhas como argumento de terminal, pois elas podem ficar no histórico. Este bootstrap é direcionado a testes locais e portfólio. Depois, exclua com segurança a cópia local da chave quando não for mais necessária.

## 3. Convidar usuários

1. Entre como administrador e vá em **Pessoas & equipes**.
2. Clique **Convidar pessoa**, escolha perfil e categorias de atendimento (ex.: Bruno → Marketing, Intranet e Hardware).
3. Compartilhe com a pessoa o endereço da aplicação; **o sistema ainda não envia e-mail de convite automaticamente**.
4. A pessoa clica **Recebeu um convite? Ativar acesso**, cadastra nome, e-mail e senha, e recebe a verificação do Firebase.
5. Depois de confirmar o endereço, retorna ao sistema e clica **Concluir ativação**. Se necessário, entre com a conta criada antes de concluir.

Atendentes veem chamados de suas categorias; solicitantes veem apenas os seus. Administradores veem todos. Atribuição é manual, por atendente habilitado na categoria. A demo também permite simular todas essas ações.

## 4. Tecnologias

- React 19 + TypeScript + Vite
- Firebase Authentication + Firestore
- Recharts, Lucide React
- CSS personalizado; DM Sans, Manrope e Space Mono
- Sem backend próprio nesta versão. Dados reais persistidos no Firebase.

## 5. Produção e GitHub

Para verificar a compilação e testar a distribuição:

```bash
npm run build
npm run preview
```

Faça commit **sem `service-account.json`, `.env`, `node_modules` ou `dist`**:

```bash
git init
git add .
git commit -m "feat: TaskFlow service desk com Firebase e demo"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/taskflow.git
git push -u origin main
```

Para usar domínio próprio, publique o diretório `dist` em **Vercel** (build `npm run build`, output `dist`) ou Firebase Hosting, e configure DNS no provedor. GitHub Pages também funciona com ajuste de base para subdiretório se necessário.

## Organização

```text
src/
  App.tsx       interface, navegação e módulos
  style.css     identidade visual, dark/light, responsivo
  types.ts      entidades e papéis
  demo.ts       45 chamados, pessoas e categorias fictícias
  firebase.ts   inicialização SDK
  real.ts       operações Firebase
scripts/
  bootstrap.mjs primeiro administrador e empresa
firestore.rules regras iniciais de segurança
```

## Escopo e limitações conhecidas

- **Demo funcional**: dados temporários por aba, sem tocar na produção.
- **Empresa real**: uma empresa por instalação Firebase (`companies/main`), personalização posterior. Não há multi-tenant completo.
- **Sem upload de anexos/logotipo nesta versão**: Firebase Storage pode ser incluído posteriormente.
- **Sem envio automático de convite**: admin registra convite e compartilha a URL.
- **Indicadores básicos**: SLA empresarial, automação de atribuição, notificações e registros auditáveis completos são melhorias futuras. O histórico de comentários já é exibido.
- **Segurança**: regras limitam quem pode ler/alterar chamados e convidar usuários. É um projeto de portfólio, não foi submetido a auditoria de segurança. A versão atual não trata limites de taxa, moderação de textos ou políticas corporativas avançadas.
- **Bootstrap** usa chave privada exclusivamente no terminal local. Nunca exponha a chave. As chaves web `VITE_FIREBASE_*` são identificadores públicos, e não substituem regras de segurança.
- **Convites** vinculados a endereço verificado e a permissões registradas pelo administrador. Não compartilhe acesso administrativo indiscriminadamente.
- **Atenção**: o gerenciamento dos papéis é feito por regras do Firestore, não custom claims. Para organizações grandes, recomenda-se backend para criação de contas, auditoria e regras de negócio mais sofisticadas.
