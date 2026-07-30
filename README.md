# Alberuni University

Full-stack university website built with React + Express + PostgreSQL.

## Stack

- **Frontend**: React 19, Vite, Tailwind CSS, shadcn/ui, Wouter (SPA routing)
- **Backend**: Express 5, Pino logger, cookie-parser
- **Database**: PostgreSQL via Drizzle ORM
- **Package manager**: pnpm (monorepo)

## Project structure

```
artifacts/
  api-server/   Express backend — serves API + built frontend
  alberuni/     React frontend
lib/
  db/           Drizzle schema & database connection
  api-zod/      Zod schemas generated from OpenAPI spec
  api-client-react/  React Query hooks generated from OpenAPI spec
  api-spec/     OpenAPI specification + Orval codegen config
```

## Deploy on Render

1. Push this repo to GitHub.
2. Create a **Web Service** on Render.
3. Set:
   - **Build command**: `pnpm install && pnpm run build`
   - **Start command**: `pnpm --filter @workspace/api-server start`
4. Add environment variables (see below).

Or use the included `render.yaml` for one-click Blueprint deploy.

## Required environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Random string for signed cookies (min 32 chars) |
| `NODE_ENV` | Set to `production` |
| `PORT` | Port to listen on (Render sets this automatically) |
| `ADMIN_USERNAME` | Admin panel username (default: `admin`) |
| `ADMIN_PASSWORD` | Admin panel password |

## Local development

```bash
# Install dependencies
pnpm install

# Start the API server (set DATABASE_URL and SESSION_SECRET in env first)
PORT=3001 NODE_ENV=development pnpm --filter @workspace/api-server dev

# Start the frontend dev server
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/alberuni dev
```

## Database schema migrations

```bash
# Push schema to database
DATABASE_URL=<url> pnpm --filter @workspace/db push
```
