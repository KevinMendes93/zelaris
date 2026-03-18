# Zelaris

Web system for operational management of a facility services company.

This project centralizes the registration of clients, employees, and roles, as well as the management of service routines, team allocation, and tracking of worked hours.

## Overview

Zelaris is built as a **fullstack monorepo** with:

- **Frontend:** Next.js + React + TypeScript
- **Backend:** NestJS + TypeScript + TypeORM
- **Database:** PostgreSQL
- **Authentication:** JWT with `httpOnly` cookies (access + refresh token)

## Main Features

- User authentication (login, refresh, logout, and password recovery)
- Registration and management of **clients**
- Registration and management of **roles**
- Registration and management of **employees**
- Registration and management of **services** (operational routine)
- **Employee allocation to services**
- Work hours tracking, including FT (full-time) information
- Management of additional employee data (documentation, attachments, bank account, transportation voucher)

## Monorepo Structure

```text
.
├─ apps/
│  ├─ zelaris-backend/   # NestJS API
│  └─ zelaris-frontend/  # Next.js web app
├─ package.json          # root orchestrated scripts
└─ README.md
```

## Requirements

- Node.js 20+
- npm 10+
- PostgreSQL 16 (or Docker)

## Installation

At the project root:

```bash
npm install
```

## Environment Configuration

### 1) Backend (`apps/zelaris-backend/.env`)

Use the file `apps/zelaris-backend/.env.example` as a base:

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

Create the file with:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Database (PostgreSQL with Docker)

In the backend folder:

```bash
cd apps/zelaris-backend
docker compose -f docker/postgres.yml up -d
```

> The database starts with: `postgres/postgres`, database `zelaris`, port `5432`.

## Migrations

In the backend:

```bash
cd apps/zelaris-backend
npm run migration:run
```

Useful commands:

- `npm run migration:generate -- src/database/migrations/YourMigrationName`
- `npm run migration:revert`

## Development Run

At the **root** of the monorepo:

```bash
npm run dev
```

This starts:

- Frontend at `http://localhost:3000`
- Backend at `http://localhost:3001`

## Main Scripts

### Root

- `npm run dev` — runs frontend + backend simultaneously
- `npm run build` — builds both apps
- `npm run lint` — lints both apps
- `npm run test` — backend tests

### Backend (`apps/zelaris-backend`)

- `npm run dev` — API in watch mode
- `npm run build` — NestJS build
- `npm run test` — unit tests
- `npm run test:e2e` — end-to-end tests
- `npm run migration:run` — applies migrations

### Frontend (`apps/zelaris-frontend`)

- `npm run dev` — Next.js in development
- `npm run build` — production build
- `npm run start` — runs built app

## Architecture Summary

- The frontend consumes the API via `NEXT_PUBLIC_API_URL`.
- Authentication uses `httpOnly` cookies (`access_token` and `refresh_token`).
- The backend validates requests with a global `ValidationPipe`.
- CORS is controlled by `FRONTEND_URL`.
- Local uploads are served at `/uploads` on the backend.

## Deploy

There are Vercel configuration files in each app:

- `apps/zelaris-frontend/vercel.json`
- `apps/zelaris-backend/vercel.json`

The backend also has a serverless handler at `apps/zelaris-backend/api/index.ts`.

## Business Domain (summary)

The system serves facility services companies that need end-to-end operations:

- Plan and register services per client
- Allocate employees by period/shift to each service
- Track worked hours and workday classifications
- Maintain a registration and documentation base for the team

With this, Zelaris supports both **daily operational control** and the company's **administrative organization**.
