## JamRock Island Cove

Modern Jamaican restaurant experience built with Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, React Hook Form + Zod, and TanStack Query. PR-based workflow targeting pickup + delivery, Stripe payments, Supabase Postgres/Storage, Mapbox validation, and admin tools.

### Getting Started

```bash
pnpm install
pnpm dev
```

### Quality gates

- `pnpm lint` - Next.js linting (ESLint flat config)
- `pnpm typecheck` - TypeScript `--noEmit`
- `pnpm build` - production build
- `pnpm format` / `pnpm format:check` - Prettier with Tailwind class sorting

### Environment

Copy `.env.example` to `.env.local` and fill Supabase, Stripe, Mapbox, and Resend values before running auth, database, or payments flows.

### Conventions

- Branches: `feat/*`, `fix/*`, `chore/*`
- PRs must include summary, screenshots (for UI), and "How to test"
- Default branch: `main`; always open PRs (no direct commits)
