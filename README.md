# TaskFlow

Um sistema web para organizar chamados internos. Fiz esse projeto para praticar desenvolvimento front-end com React e TypeScript e também entender melhor como funciona uma aplicação com login, banco de dados e permissões de usuário.

A ideia é simples: a pessoa abre um chamado, escolhe a categoria e o atendimento fica disponível para quem cuida daquele assunto. Por exemplo, um atendente pode cuidar de Marketing, Intranet e Hardware, enquanto outro fica responsável por acessos e liberação de sites.

O projeto ainda está evoluindo. Tem coisas que já dá para testar e outras que quero melhorar antes de pensar em uso real por uma empresa.

## O que já tem

- Login com e-mail e senha pelo Firebase Authentication.
- Chamados com categoria, prioridade, status e responsável.
- Cadastro de categorias e vínculo com atendentes.
- Três tipos de usuário: administrador, atendente e solicitante.
- Dashboard com indicadores e gráficos básicos.
- Tema claro e escuro, escolhido por cada pessoa.
- Um modo de demonstração para conhecer o sistema sem criar conta.

No modo demo, os dados são fictícios e ficam salvos apenas na sessão do navegador. Dá para trocar entre os perfis e testar as telas. **Essa troca de perfil é uma simulação**, não um login real com permissões no Firebase.

## Tecnologias

React, TypeScript, Vite, Firebase Authentication, Cloud Firestore, Recharts e CSS. Os ícones são do Lucide.

## Rodando na sua máquina

Precisa ter o Node.js e o npm instalados.

```bash
npm install
npm run dev
```

Abra o endereço informado no terminal, geralmente `http://localhost:5173`.

Para testar apenas a demo, não é necessário preparar o banco. Na tela inicial, escolha **Explorar demonstração**.

Para testar a integração real com o Firebase, copie `.env.example` para `.env`:

```powershell
Copy-Item .env.example .env
```

As variáveis do Firebase Web já vêm com a configuração do projeto de desenvolvimento. O arquivo `.env` não deve ser enviado ao Git. A configuração Web identifica o projeto, mas **não substitui as regras de segurança**.

## Configurando o Firebase

O projeto usa o Firebase `taskflow-7d1cf`. Para testar com contas reais:

1. Ative o método **E-mail/Senha** no Firebase Authentication.
2. Crie um banco no **Cloud Firestore**, se ainda não existir.
3. Confira os domínios autorizados na configuração do Authentication.
4. Instale o Firebase CLI e publique as regras e índices deste repositório:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,firestore:indexes --project taskflow-7d1cf
```

**Cuidado:** publicar as regras pode substituir regras que já existam nesse projeto Firebase. Confira isso antes do deploy.

### Criando a empresa e o primeiro administrador

O primeiro administrador não é cadastrado pela tela pública. Use o script local `scripts/bootstrap.mjs` com uma chave de conta de serviço do Firebase:

```bash
node scripts/bootstrap.mjs service-account.json admin@empresa.com.br "SENHA_FORTE" "Nome da Empresa"
```

A chave é gerada em **Configurações do projeto > Contas de serviço** no Firebase Console. Ela deve ficar apenas no computador de quem está configurando o ambiente. Nunca envie esse JSON para o GitHub. O `.gitignore` já ignora arquivos `service-account*.json`.

O comando acima coloca a senha no histórico do terminal. Por isso, use apenas em um ambiente de teste controlado e não reutilize uma senha pessoal. O script não substitui um processo de provisionamento adequado para produção.

Depois do cadastro inicial, o administrador pode configurar categorias e convidar outros usuários pela interface. Nesta versão, o convite **não envia e-mail automaticamente**: o administrador precisa compartilhar o endereço do sistema com a pessoa convidada.

## Estrutura do projeto

```text
src/
  App.tsx       telas e fluxos da aplicação
  style.css     estilos e temas
  demo.ts       dados usados no modo demonstração
  firebase.ts   conexão com o Firebase
  real.ts       operações com os dados reais
  types.ts      tipos usados no projeto
scripts/
  bootstrap.mjs configuração inicial da empresa
firestore.rules regras de acesso ao banco
```

## Gerando a versão de produção

```bash
npm run build
npm run preview
```

O build é gerado na pasta `dist`. Antes de publicar, vale testar os fluxos principais com contas de cada perfil e conferir as regras do Firestore.

## O que ainda quero melhorar

- Upload de anexos e logotipo da empresa.
- Envio automático de convites e notificações.
- Distribuição automática dos chamados entre atendentes.
- Indicadores de SLA mais completos.
- Testes automatizados e melhor separação dos componentes do `App.tsx`.
- Auditoria e validação de segurança antes de qualquer uso corporativo.

Atualmente a instalação trabalha com uma empresa no caminho `companies/main`. Não é uma plataforma multiempresa completa. O modo demo funciona separado da base real.

## Repositório

[github.com/brunonascimentodata/TaskFlow](https://github.com/brunonascimentodata/TaskFlow)

Projeto de estudo e portfólio, em desenvolvimento.
