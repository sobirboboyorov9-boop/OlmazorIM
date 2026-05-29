# Al-Beruni University Website

A full professional clone of alberuni.uz — Al-Beruni University, Nukus, Uzbekistan. Includes a public-facing site and a full admin panel for content management.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — cookie signing

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, Framer Motion, wouter (routing)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/alberuni/src/` — React frontend (public site + admin panel)
- `artifacts/api-server/src/routes/` — Express API routes
- `lib/db/src/schema/` — Drizzle DB schema (one file per entity)
- `lib/api-spec/` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/src/generated/` — Generated React Query hooks
- `lib/api-zod/src/generated/` — Generated Zod schemas

## Architecture decisions

- Contract-first API design: OpenAPI spec drives codegen for both hooks and Zod validators
- Cookie-based admin auth: signed `alberuni_admin` cookie; admin credentials via env vars
- All content is DB-driven: news, banners, statistics, gallery, contacts, and homepage text are all editable via admin panel
- Uzbek-language UI for public site and admin panel
- `wouter` for lightweight client-side routing (no Next.js)

## Product

**Public site:**
- `/` — Homepage with hero slider, statistics, about section, featured news, gallery, contact strip
- `/news` — Paginated news list with category filters
- `/news/:id` — Article detail page
- `/contact` — Contact info page

**Admin panel (requires login):**
- `/admin/login` — Login page (admin / alberuni2024)
- `/admin` — Dashboard with counts and recent news
- `/admin/news` — Full news CRUD
- `/admin/banners` — Hero slider banner CRUD
- `/admin/statistics` — Edit homepage statistics counters
- `/admin/gallery` — Gallery image CRUD
- `/admin/contacts` — Edit contact info and social links
- `/admin/content` — Edit homepage text (hero, about, mission, vision)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm run typecheck:libs` after editing any lib schema or types, before typechecking leaf packages
- Admin auth uses signed cookies — `SESSION_SECRET` env var must be set (already configured)
- After running `pnpm --filter @workspace/api-spec run codegen`, the generated hooks in `lib/api-client-react` are updated automatically; no further build step needed
- The generated hooks require explicit `queryKey` in options (not just `retry: false`)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
