# Plataforma de Eventos - Web e API REST

Este projeto e uma aplicacao full-stack desenvolvida em Next.js 16 (App Router), responsavel por renderizar a interface web do sistema e fornecer a API REST utilizada pelo aplicativo mobile.

Escopo deste repositorio: Este arquivo documenta exclusivamente o projeto Web. O aplicativo React Native/Expo esta em um repositorio separado e nao deve ser copiado para este diretorio nem acessar o banco de dados diretamente.

---

## 1. Visao Geral e Tecnologias

A aplicacao unifica o frontend web e a API REST em um unico servidor Node.js. O Next.js 16 gerencia as paginas e os endpoints HTTP, enquanto o Prisma ORM faz a ponte de comunicacao tipada com o banco de dados PostgreSQL hospedado na nuvem via Supabase.

### Tecnologias e Responsabilidades

- **Next.js 16 (App Router):** Renderizacao de paginas web e execucao dos Route Handlers (API REST).
- **React e TypeScript:** Construcao de componentes de interface, gerenciamento de estado e tipagem estatica.
- **Prisma ORM:** Mapeamento objeto-relacional e acesso tipado ao PostgreSQL.
- **Supabase / PostgreSQL:** Banco de dados relacional hospedado em nuvem.
- **jsonwebtoken:** Geracao, assinatura e validacao de tokens JWT para autenticacao.
- **bcrypt:** Algoritmo para hash e verificacao de senhas.
- **Tailwind CSS:** Estilizacao e utilitarios visuais para o frontend.
- **Node.js e npm:** Ambiente de execucao do servidor e gerenciamento de dependencias.

---

## 2. Arquitetura e Fluxos

### Fluxo Geral de Comunicacao

1. **Navegador:** Acessa as paginas em `src/app/**/page.tsx` ou realiza chamadas HTTP para `/api/...`.
2. **Route Handlers:** Arquivos `src/app/api/**/route.ts` recebem as requisicoes, executam a validacao de entrada, checam a autenticacao via JWT e aplicam as regras de negocio.
3. **Prisma Client:** Instancia compartilhada em `src/lib/prisma.ts` executa consultas SQL no Supabase.
4. **Aplicativo Mobile:** Realiza chamadas HTTP/JSON para `http://IP-LOCAL:3000/api/...`. O Mobile nao acessa o PostgreSQL diretamente.

### Fluxo de Autenticacao (Login)

1. O cliente envia `POST /api/auth/login` com os campos `email` e `senha`.
2. O servidor localiza o usuario pelo e-mail e compara a senha enviada com o hash salvo no banco utilizando `bcrypt.compare`.
3. Se as credenciais forem validas, o backend gera e assina um token JWT com `jsonwebtoken` utilizando a chave secreta `JWT_SECRET`.
4. A API retorna o token gerado e os dados publicos do usuario (ID, nome, e-mail).
5. O cliente deve enviar o token recebido no cabecalho `Authorization: Bearer <token>` em requisicoes subsequentes a rotas protegidas.

### Fluxo de Inscricao em Eventos

1. O cliente envia `POST /api/registrations` contendo `eventId` no corpo e o cabecalho `Authorization: Bearer <token>`.
2. A API valida o JWT fornecido e extrai o identificador do usuario diretamente do payload verificado.
3. O Prisma verifica se ja existe uma inscricao duplicada para aquele evento e registra a nova inscricao.
4. A API responde com o resultado em formato JSON e o codigo de status HTTP apropriado.

---

## 3. Estrutura de Pastas Detalhada

```text
web/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       └── 20261024183758_init/
│           ├── migration.sql
│           └── migration_lock.toml
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── register/route.ts
│   │   │   ├── events/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── registrations/route.ts
│   │   │   ├── registrations/
│   │   │   │   └── route.ts
│   │   │   ├── my-registrations/
│   │   │   │   └── route.ts
│   │   │   ├── registrations/[id]/
│   │   │   │   └── route.ts
│   │   │   └── users/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── evento/[id]/page.tsx
│   │   ├── novo/page.tsx
│   │   ├── usuarios/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── prisma.ts
├── .env
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

### Modelos de Dados (Prisma Schema)

- **Usuario:** Armazena `id`, `nome`, `email` (unico), `senha` (hash bcrypt), `createdAt` e a relacao com inscricoes.
- **Evento:** Armazena `id`, `titulo`, `descricao`, `data`, `horario`, `local`, `imagem` (opcional), `createdAt` e a relacao com inscricoes.
- **Inscricao:** Relaciona `Usuario` e `Evento`, armazena `createdAt` e possui uma restricao de unicidade para evitar inscricoes duplicadas do mesmo usuario no mesmo evento.

Nota: Os campos `data` e `horario` no schema atual sao armazenados como texto, necessitando de cuidados adicionais com ordenacao, fusos horarios e validacao.

---

## 4. Contrato da API REST

| Metodo | Caminho da Rota               | Descricao da Operacao                                | Comportamento de Autenticacao         |
| ------ | ----------------------------- | ---------------------------------------------------- | ------------------------------------- |
| POST   | /api/auth/register            | Cadastra um novo usuario                             | Publico                               |
| POST   | /api/auth/login               | Realiza login e retorna JWT                          | Publico                               |
| GET    | /api/events                   | Lista todos os eventos ordenados por data de criacao | Publico                               |
| POST   | /api/events                   | Cria um novo evento                                  | Publico (Sem checagem de autorizacao) |
| GET    | /api/events/:id               | Consulta evento por ID e exibe inscricoes ligadas    | Publico                               |
| PUT    | /api/events/:id               | Atualiza os dados de um evento                       | Publico (Sem checagem de autorizacao) |
| DELETE | /api/events/:id               | Exclui um evento                                     | Publico (Sem checagem de autorizacao) |
| POST   | /api/events/:id/registrations | Cria inscricao informando usuario no corpo           | Publico (Confia no usuarioId enviado) |
| POST   | /api/registrations            | Cria inscricao para o usuario autenticado            | Requer JWT                            |
| GET    | /api/my-registrations         | Lista as inscricoes do usuario logado                | Requer JWT                            |
| DELETE | /api/registrations/:id        | Cancela uma inscricao pelo ID                        | Publico (Nao valida propriedade)      |
| GET    | /api/users                    | Lista todos os usuarios cadastrados                  | Publico                               |
| DELETE | /api/users/:id                | Exclui um usuario e suas inscricoes                  | Publico (Sem checagem de autorizacao) |

### Formato de Autenticacao Esperado

Nas rotas protegidas por JWT, envie o cabeçalho no seguinte formato:

```http
Authorization: Bearer <SEU_TOKEN_JWT>
```

---

## 5. Configuracao de Variaveis de Ambiente

Crie o arquivo `.env` na raiz do projeto Web (no mesmo nivel do `package.json`):

```env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST-DO-SUPABASE:PORTA/postgres?pgbouncer=true"
DIRECT_URL="postgresql://USUARIO:SENHA@HOST-DO-SUPABASE:PORTA_DIRETA/postgres"
JWT_SECRET="insira_um_segredo_aleatorio_e_forte_aqui"
```

### Como gerar um segredo forte para JWT_SECRET

Execute o seguinte comando no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie a string hex gerada para a variavel `JWT_SECRET`. Nao envie o arquivo `.env` para versionamento no Git.

---

## 6. Passo a Passo para Instalacao e Execucao Local

### 1. Clonar o Repositorio

```bash
git clone <URL_DO_REPOSITORIO_WEB>
cd <PASTA_CRIADA>
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Gerar o Cliente Prisma

```bash
npx prisma generate
```

### 4. Sincronizar o Banco de Dados

```bash
npx prisma db push
```

### 5. Iniciar o Servidor de Desenvolvimento

Para uso estritamente local (computador):

```bash
npm run dev
```

Para permitir que dispositivos na mesma rede local (como o celular acessando o app mobile) alcancem a API:

```bash
npm run dev -- --hostname 0.0.0.0
```

O servidor estara em execucao na porta 3000 (`http://localhost:3000`).

---

## 7. Limitacoes Conhecidas e Seguranca

Antes de implantar em ambiente de producao ou disponibilizar dados reais, corrija as seguintes pendencias identificadas no codigo:

1. **Exposicao de Hashes de Senha:** Os endpoints `GET /api/users` e `GET /api/events/:id` retornam objetos completos de usuarios, incluindo a propriedade `senha`. Utilize a clausula `select` do Prisma para omitir senhas nas respostas.
2. **Falta de Controle de Acesso Administrativo:** As rotas de criacao, edicao e exclusao de eventos e usuarios nao checam permissoes de administrador no servidor.
3. **Cancelamento de Inscricao sem Validacao de Titularidade:** A rota `DELETE /api/registrations/:id` nao verifica se a inscricao pertence ao usuario que solicita o cancelamento.
4. **Instancias Prisma Inconsistentes:** Certifique-se de importar o cliente compartilhado de `src/lib/prisma.ts` em todos os Route Handlers em vez de instanciar `new PrismaClient()` localmente.
5. **Segredo JWT Padrão de Fallback:** Remova qualquer valor padrao (fallback) para `JWT_SECRET` no codigo e exija a configuracao explicita no arquivo `.env`.
6. **Validacao de Entradas:** Implemente esquemas de validacao de dados (ex: Zod) no lado do servidor em todos os handlers HTTP.

---

## 8. Comandos de Referencia

```bash
# Gerar Prisma Client
npx prisma generate

# Sincronizar Schema com o Banco
npx prisma db push

# Validar arquivo Schema
npx prisma validate

# Executar painel grafico do banco (Prisma Studio)
npx prisma studio

# Checagem de tipos estaticos do TypeScript
npx tsc --noEmit

# Compilacao para producao
npm run build
```
