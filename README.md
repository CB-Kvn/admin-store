# Monorepo Grema Store (Admin)

Monorepo con Turborepo, TypeScript, React (Vite) y Node/Express.

## Estructura

- `apps/web`: Frontend en React + Vite + TypeScript
- `apps/api`: Backend en Node/Express + TypeScript
- `packages/tsconfig`: Configuraciones compartidas de TypeScript

## Scripts

- `npm run dev`: inicia todos los proyectos en paralelo (web y api)
- `npm run build`: compila todos los proyectos
- `npm run lint`: ejecuta lint en todos los proyectos (placeholder)

## Desarrollo

1. Instalar dependencias: `npm install`
2. Levantar entorno: `npm run dev`
   - Web: http://localhost:5173/
   - API: http://localhost:3000/health

## Base de datos (Postgres + Prisma)

- Configura `apps/api/.env` con `DATABASE_URL`.
- Habilitar extensión `pgcrypto` (necesaria para `gen_random_uuid()`):
  - Se incluye migración: `apps/api/prisma/migrations/20251109_enable_pgcrypto/migration.sql`.
  - Aplica migraciones: `npm run prisma:migrate -w apps/api -- --name init_pg`
    - Requiere permisos para `CREATE EXTENSION` en la base de datos.
- Regenerar cliente: `npm run prisma:generate -w apps/api`

## Notas

Este repo usa npm workspaces. No requiere pnpm/yarn.