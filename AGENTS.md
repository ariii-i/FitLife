# FitLife AGENTS.md

This is a monorepo managed with Turborepo (pnpm workspaces) containing a React client and a Node.js server.

## Repo Layout

```
FitLife/
├── packages/
│   ├── client/           React (Vite, React 19, Tailwind CSS v4, Radix UI)
│   │   ├── src/
│   │   │   ├── components/ui/      shadcn/ui-style components
│   │   │   ├── entities/           data layer (api/, modal/, types)
│   │   │   ├── features/           feature modules (feature-name/ui/, model/)
│   │   │   ├── hooks/              custom React hooks
│   │   │   ├── pages/              page-level components
│   │   │   ├── shared/lib/         utilities (utils, orpc, firebase, sanity)
│   │   │   └── widget/             page-level widgets / sections
│   │   └── intern-project/        Sanity Studio sub-project
│   └── server/           Node.js (tsx, Objection.js/Knex, ORPC, SQLite)
│       ├── src/
│       │   ├── orpc-server/        ORPC router and procedures
│       │   │   ├── db/             Knex database connection
│       │   │   └── packages/      domain packages (workout, exercise, user)
│       │   │       └── <domain>/
│       │   │           ├── domain/    Objection models + Zod schemas
│       │   │           ├── route.ts   ORPC router export
│       │   │           └── use-cases/ ORPC procedure handlers
│       │   ├── foundation.ts
│       │   └── index.ts            entrypoint
│       └── knexfile.ts
├── turbo.json
└── package.json
```

## Build / Lint / Test Commands

### Root
```bash
pnpm install              # Install all workspace dependencies
pnpm run dev              # Dev both server and client via turbo
pnpm server:dev          # Dev server only: pnpm --filter server dev
pnpm client:dev           # Dev client only: pnpm --filter client dev
```

### Client (`packages/client`)
```bash
pnpm --filter client dev           # Start dev server (Vite, port 5173)
pnpm --filter client build         # Production build
pnpm --filter client lint           # Run ESLint
pnpm --filter client preview        # Preview production build
```

### Server (`packages/server`)
```bash
pnpm --filter server dev                          # tsx watch src/index.ts
pnpm --filter server test                         # Run all vitest tests
npx vitest run <path/to/file.test.ts>            # Run single test file
npx vitest run -t "test name pattern"            # Run tests matching name
pnpm --filter server format                       # Prettier format (--write)
pnpm --filter server migrate:latest               # Run pending migrations
pnpm --filter server migrate:rollback            # Rollback last migration
pnpm --filter server migrate:make <name>          # Create new migration
pnpm --filter server seed:run                    # Run seed files
```

## Code Style Guidelines

### General Principles
- Make small, focused changes. Preserve established patterns.
- Favor clarity and types over clever constructs.
- Use `cn()` from `shared/lib/utils` for conditional class merging (clsx + tailwind-merge).

### Imports
**Client:** Use path aliases (`@/` maps to `src/`). External imports before relative.
```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useWorkoutStore } from "@/entities/workout/modal/store";
```

**Server:** Three groups with blank lines: Node builtins → external packages → internal modules.
```typescript
import type { IncomingHttpHeaders } from "node:http";
import * as z from "zod";
import { WorkoutModel } from "../domain/workout";
```

### Formatting (Prettier — server-side baseline)
```json
{ "semi": true, "singleQuote": false, "tabWidth": 2, "printWidth": 100, "trailingComma": "es5" }
```
Run `pnpm --filter server format` before committing server changes.

### Types and Naming

**Client (React):**
- Components: PascalCase files (`Button.tsx`, `workout-list/ui/index.tsx`).
- Functions/hooks: camelCase (`fetchWorkouts`, `useMobile`).
- Stores (Zustand): prefix with `use`, camelCase (`useWorkoutStore`).
- Store state shape: `type WorkoutStore = { ... }` with explicit action signatures.
- Type inference: prefer `z.infer<typeof Schema_*>` over manual type duplication.
- Avoid `any`; use `unknown` with type guards or casting when unavoidable.

**Server (Node.js):**
- Type aliases: `T_*` prefix (e.g. `T_CreateWorkoutPayload`).
- Zod schemas: `Schema_*` prefix (e.g. `Schema_Create_Workout`).
- Objection models: PascalCase with `Model` suffix (e.g. `WorkoutModel`).
- Functions/procedures: snake_case (e.g. `list_workout_by_user`, `create_workout`).
- Exported route objects: camelCase (e.g. `workout: { create, list, ... }`).
- Constants: UPPER_SNAKE_CASE (e.g. `ACTION_TYPE_*`).

### Project-Specific Patterns

**ORPC Procedures (server):**
- Schemas live in `domain/schema-*.ts` and are named `Schema_*`.
- Procedures live in `use-cases/index.ts` and are exported as named functions.
- Routes are re-exported from `route.ts` in the same package.
- Input/output schemas are explicit; always chain `.handler(async ({ input }) => { ... })`.

**Objection Models:**
- Extend `Model` and implement `z.infer<typeof Schema_*>` for type safety.
- Use `static tableName`, `$beforeInsert` for timestamps, `static relationMappings` for associations.
- Prefer `insertGraph`/`patchAndFetchById` for nested operations.

**Client API Layer (`entities/*/api/index.ts`):**
- All API calls go through ORPC client (`import { orpc } from "server/src/orpc-client"`).
- Import shared Zod schemas directly from server domain: `import { Schema_Create_Workout } from "server/src/orpc-server/packages/workout/domain/schema-workout"`.
- Use `z.infer<typeof Schema_*>` for typed payloads.

**Zustand Stores (`entities/*/modal/store.ts`):**
- Define store type interface explicitly (`type WorkoutStore = { ... }`).
- Actions are async for API calls, sync for local state updates.
- Accept optional callbacks for post-action side effects (`cb?: () => void`).

**React Components:**
- Prefer functional components with hooks.
- Use `React.forwardRef` for components that need ref forwarding.
- Set `displayName` for all forwarded components.
- Use `class-variance-authority` (CVA) for variant-based styling.

### Error Handling
- Server: use try/catch in handlers; return meaningful values rather than throwing.
- Client: handle async errors in stores/actions; use `console.error` sparingly in UI code.
- No `console.log` in production code paths.

### Testing
- Server uses **Vitest** (`vitest`).
- Place test files next to the modules they test: `src/foo/bar.ts` → `src/foo/bar.test.ts`.
- Tests should be self-contained with small fixtures.

## Cursor / Copilot Rules
No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` are present. If added, agents must obey them.

## Git Hygiene
- Never run `git reset --hard` or `git checkout --` unless explicitly requested.
- Only commit when asked. Create small, focused commits.
- Never force-push to protected branches.
