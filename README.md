# Zelaris

Sistema web para gestão operacional de uma empresa de zeladoria.

O projeto centraliza o cadastro de clientes, funcionários e funções, além do gerenciamento da rotina de serviços, alocação de equipe e controle de horas trabalhadas.

## Visão geral

O Zelaris foi construído como **monorepo fullstack** com:

- **Frontend:** Next.js + React + TypeScript
- **Backend:** NestJS + TypeScript + TypeORM
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT com cookies `httpOnly` (access + refresh token)

## Funcionalidades principais

- Autenticação de usuários (login, refresh, logout e recuperação de senha)
- Cadastro e gestão de **clientes**
- Cadastro e gestão de **funções**
- Cadastro e gestão de **funcionários**
- Cadastro e gestão de **serviços** (rotina operacional)
- **Alocação de funcionários em serviços**
- Controle de jornada com informações de horas alocadas e FT
- Gestão de dados complementares de funcionário (documentação, anexos, conta bancária, vale transporte)

## Estrutura do monorepo

```text
.
├─ apps/
│  ├─ zelaris-backend/   # API NestJS
│  └─ zelaris-frontend/  # App web Next.js
├─ package.json          # scripts orquestrados da raiz
└─ README.md
```

## Requisitos

- Node.js 20+
- npm 10+
- PostgreSQL 16 (ou Docker)

## Instalação

Na raiz do projeto:

```bash
npm install
```

## Configuração de ambiente

### 1) Backend (`apps/zelaris-backend/.env`)

Use como base o arquivo `apps/zelaris-backend/.env.example`:

```dotenv
NODE_ENV=development
PORT=3001
TZ=America/Sao_Paulo

FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=zelaris

JWT_ACCESS_SECRET=dev-secret-access-token-change-in-production
JWT_ACCESS_EXP_MINUTES=15

JWT_REFRESH_SECRET=dev-secret-refresh-token-change-in-production
JWT_REFRESH_EXP_DAYS=7

RESET_TOKEN_SECRET=dev-secret-reset-token-change-in-production
RESET_TOKEN_EXP_MINUTES=30

AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAMESITE=lax
AUTH_COOKIE_DOMAIN=
```

### 2) Frontend (`apps/zelaris-frontend/.env.local`)

Crie o arquivo com:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Banco de dados (PostgreSQL com Docker)

Na pasta do backend:

```bash
cd apps/zelaris-backend
docker compose -f docker/postgres.yml up -d
```

> O banco sobe com: `postgres/postgres`, database `zelaris`, porta `5432`.

## Migrations

No backend:

```bash
cd apps/zelaris-backend
npm run migration:run
```

Comandos úteis:

- `npm run migration:generate -- src/database/migrations/NomeDaMigration`
- `npm run migration:revert`

## Execução em desenvolvimento

Na **raiz** do monorepo:

```bash
npm run dev
```

Isso inicia:

- Frontend em `http://localhost:3000`
- Backend em `http://localhost:3001`

## Scripts principais

### Raiz

- `npm run dev` — frontend + backend simultaneamente
- `npm run build` — build dos dois apps
- `npm run lint` — lint dos dois apps
- `npm run test` — testes do backend

### Backend (`apps/zelaris-backend`)

- `npm run dev` — API em modo watch
- `npm run build` — build NestJS
- `npm run test` — testes unitários
- `npm run test:e2e` — testes end-to-end
- `npm run migration:run` — aplica migrations

### Frontend (`apps/zelaris-frontend`)

- `npm run dev` — Next.js em desenvolvimento
- `npm run build` — build de produção
- `npm run start` — sobe aplicação buildada

## Arquitetura resumida

- O frontend consome a API via `NEXT_PUBLIC_API_URL`.
- A autenticação usa cookies `httpOnly` (`access_token` e `refresh_token`).
- O backend valida requisições com `ValidationPipe` global.
- CORS é controlado por `FRONTEND_URL`.
- Uploads locais são servidos em `/uploads` no backend.

## Deploy

Existem arquivos de configuração para Vercel em cada app:

- `apps/zelaris-frontend/vercel.json`
- `apps/zelaris-backend/vercel.json`

O backend também possui handler serverless em `apps/zelaris-backend/api/index.ts`.

## Domínio do negócio (resumo)

O sistema atende empresas de zeladoria que precisam operar ponta a ponta:

- Planejar e registrar serviços por cliente
- Alocar funcionários por período/turno em cada serviço
- Acompanhar horas trabalhadas e classificações de jornada
- Manter base cadastral e documental da equipe

Com isso, o Zelaris apoia tanto o **controle operacional diário** quanto a **organização administrativa** da empresa.
