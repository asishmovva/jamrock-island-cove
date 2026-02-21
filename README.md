## JamRock Island Cove

Modern Jamaican restaurant experience built with Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, React Hook Form + Zod, and TanStack Query. PR-based workflow targeting pickup + delivery, Stripe payments, Supabase Postgres/Storage, Mapbox validation, and admin tools.

### Getting Started

```bash
pnpm install
pnpm dev
```

- App Router lives in `src/app`, shared components in `src/components`, utilities in `src/lib`.
- Placeholder routes: `/`, `/menu`, `/login`, `/signup`, `/admin` (to be wired in later PRs).

### Quality gates

- `pnpm lint` - Next.js linting (ESLint flat config)
- `pnpm typecheck` - TypeScript `--noEmit`
- `pnpm build` - production build
- `pnpm format` / `pnpm format:check` - Prettier with Tailwind class sorting

### Environment

Copy `.env.example` to `.env.local` and fill Supabase, Stripe, Mapbox, and Resend values before running auth, database, or payments flows.

- Supabase Auth reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; user roles live in Supabase `app_metadata.role` (defaults to `customer`, set to `admin` manually for admin access).

### Database security

- After `prisma db push`, run `supabase/sql/pr-db-3-rls-auth-sync.sql` in the Supabase SQL editor to enable RLS and auth user sync triggers.
- SQL script usage notes are in `supabase/sql/README.md`.
- Order creation currently runs through `POST /api/orders`, where totals are recomputed server-side before writes. RLS remains enabled for Supabase client access paths.
- Load demo menu data with `pnpm prisma db seed`.

### Conventions

- Branches: `feat/*`, `fix/*`, `chore/*`
- PRs must include summary, screenshots (for UI), and "How to test"
- Default branch: `main`; always open PRs (no direct commits)
