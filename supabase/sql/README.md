# Supabase SQL scripts

## PR-DB-3: RLS + Auth sync

Run `supabase/sql/pr-db-3-rls-auth-sync.sql` in the Supabase SQL editor after `prisma db push` is complete.

What it does:
- Syncs `auth.users` into `public."User"` using triggers
- Backfills existing auth users into `public."User"`
- Enables RLS on user/address/menu/order/payment tables
- Adds owner/admin/guest-safe policies for read/write paths

Role mapping:
- `app_metadata.role = "admin"` -> `public."User".role = ADMIN`
- anything else -> `public."User".role = CUSTOMER`
