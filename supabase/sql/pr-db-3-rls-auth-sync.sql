begin;

-- Determine app role from JWT metadata.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() ->> 'role')) = 'admin',
    false
  );
$$;

-- Sync auth.users rows to public."User" for profile/role access in app queries.
create or replace function public.sync_auth_user_to_public_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_role public."UserRole";
begin
  next_role :=
    case lower(coalesce(new.raw_app_meta_data ->> 'role', 'customer'))
      when 'admin' then 'ADMIN'::public."UserRole"
      else 'CUSTOMER'::public."UserRole"
    end;

  insert into public."User" (
    id,
    email,
    role,
    name,
    phone,
    "createdAt",
    "updatedAt"
  ) values (
    new.id,
    new.email,
    next_role,
    nullif(new.raw_user_meta_data ->> 'name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    now(),
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    role = excluded.role,
    name = excluded.name,
    phone = excluded.phone,
    "updatedAt" = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.sync_auth_user_to_public_user();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update of email, raw_app_meta_data, raw_user_meta_data on auth.users
for each row
execute function public.sync_auth_user_to_public_user();

-- Backfill existing users once in case auth users pre-date this trigger.
insert into public."User" (
  id,
  email,
  role,
  name,
  phone,
  "createdAt",
  "updatedAt"
)
select
  au.id,
  au.email,
  case lower(coalesce(au.raw_app_meta_data ->> 'role', 'customer'))
    when 'admin' then 'ADMIN'::public."UserRole"
    else 'CUSTOMER'::public."UserRole"
  end as role,
  nullif(au.raw_user_meta_data ->> 'name', '') as name,
  nullif(au.raw_user_meta_data ->> 'phone', '') as phone,
  now(),
  now()
from auth.users au
on conflict (id) do update
set
  email = excluded.email,
  role = excluded.role,
  name = excluded.name,
  phone = excluded.phone,
  "updatedAt" = now();

alter table public."User" enable row level security;
alter table public."SavedAddress" enable row level security;
alter table public."MenuItem" enable row level security;
alter table public."Order" enable row level security;
alter table public."OrderItem" enable row level security;
alter table public."OrderItemModifier" enable row level security;
alter table public."PaymentEvent" enable row level security;

drop policy if exists user_select_self_or_admin on public."User";
create policy user_select_self_or_admin
on public."User"
for select
using (auth.uid() = id or public.is_admin());

drop policy if exists user_insert_self_or_admin on public."User";
create policy user_insert_self_or_admin
on public."User"
for insert
with check (auth.uid() = id or public.is_admin());

drop policy if exists user_update_self_or_admin on public."User";
create policy user_update_self_or_admin
on public."User"
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists saved_address_select_owner_or_admin on public."SavedAddress";
create policy saved_address_select_owner_or_admin
on public."SavedAddress"
for select
using ("userId" = auth.uid() or public.is_admin());

drop policy if exists saved_address_insert_owner_or_admin on public."SavedAddress";
create policy saved_address_insert_owner_or_admin
on public."SavedAddress"
for insert
with check ("userId" = auth.uid() or public.is_admin());

drop policy if exists saved_address_update_owner_or_admin on public."SavedAddress";
create policy saved_address_update_owner_or_admin
on public."SavedAddress"
for update
using ("userId" = auth.uid() or public.is_admin())
with check ("userId" = auth.uid() or public.is_admin());

drop policy if exists saved_address_delete_owner_or_admin on public."SavedAddress";
create policy saved_address_delete_owner_or_admin
on public."SavedAddress"
for delete
using ("userId" = auth.uid() or public.is_admin());

drop policy if exists menu_item_select_public on public."MenuItem";
create policy menu_item_select_public
on public."MenuItem"
for select
using ("isActive" = true or public.is_admin());

drop policy if exists menu_item_insert_admin on public."MenuItem";
create policy menu_item_insert_admin
on public."MenuItem"
for insert
with check (public.is_admin());

drop policy if exists menu_item_update_admin on public."MenuItem";
create policy menu_item_update_admin
on public."MenuItem"
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists menu_item_delete_admin on public."MenuItem";
create policy menu_item_delete_admin
on public."MenuItem"
for delete
using (public.is_admin());

drop policy if exists order_select_owner_or_admin on public."Order";
create policy order_select_owner_or_admin
on public."Order"
for select
using ("userId" = auth.uid() or public.is_admin());

drop policy if exists order_insert_owner_admin_or_guest on public."Order";
create policy order_insert_owner_admin_or_guest
on public."Order"
for insert
with check (
  public.is_admin()
  or ("userId" = auth.uid())
  or (auth.uid() is null and "userId" is null)
);

drop policy if exists order_update_owner_or_admin on public."Order";
create policy order_update_owner_or_admin
on public."Order"
for update
using (public.is_admin() or "userId" = auth.uid())
with check (public.is_admin() or "userId" = auth.uid());

drop policy if exists order_delete_admin on public."Order";
create policy order_delete_admin
on public."Order"
for delete
using (public.is_admin());

drop policy if exists order_item_select_owner_or_admin on public."OrderItem";
create policy order_item_select_owner_or_admin
on public."OrderItem"
for select
using (
  exists (
    select 1
    from public."Order" o
    where o.id = "orderId"
      and (o."userId" = auth.uid() or public.is_admin())
  )
);

drop policy if exists order_item_insert_owner_admin_or_guest on public."OrderItem";
create policy order_item_insert_owner_admin_or_guest
on public."OrderItem"
for insert
with check (
  exists (
    select 1
    from public."Order" o
    where o.id = "orderId"
      and (
        public.is_admin()
        or (o."userId" = auth.uid())
        or (auth.uid() is null and o."userId" is null)
      )
  )
);

drop policy if exists order_item_update_owner_or_admin on public."OrderItem";
create policy order_item_update_owner_or_admin
on public."OrderItem"
for update
using (
  exists (
    select 1
    from public."Order" o
    where o.id = "orderId"
      and (o."userId" = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public."Order" o
    where o.id = "orderId"
      and (o."userId" = auth.uid() or public.is_admin())
  )
);

drop policy if exists order_item_delete_owner_or_admin on public."OrderItem";
create policy order_item_delete_owner_or_admin
on public."OrderItem"
for delete
using (
  exists (
    select 1
    from public."Order" o
    where o.id = "orderId"
      and (o."userId" = auth.uid() or public.is_admin())
  )
);

drop policy if exists order_item_modifier_select_owner_or_admin on public."OrderItemModifier";
create policy order_item_modifier_select_owner_or_admin
on public."OrderItemModifier"
for select
using (
  exists (
    select 1
    from public."OrderItem" oi
    join public."Order" o on o.id = oi."orderId"
    where oi.id = "orderItemId"
      and (o."userId" = auth.uid() or public.is_admin())
  )
);

drop policy if exists order_item_modifier_insert_owner_admin_or_guest on public."OrderItemModifier";
create policy order_item_modifier_insert_owner_admin_or_guest
on public."OrderItemModifier"
for insert
with check (
  exists (
    select 1
    from public."OrderItem" oi
    join public."Order" o on o.id = oi."orderId"
    where oi.id = "orderItemId"
      and (
        public.is_admin()
        or (o."userId" = auth.uid())
        or (auth.uid() is null and o."userId" is null)
      )
  )
);

drop policy if exists order_item_modifier_update_owner_or_admin on public."OrderItemModifier";
create policy order_item_modifier_update_owner_or_admin
on public."OrderItemModifier"
for update
using (
  exists (
    select 1
    from public."OrderItem" oi
    join public."Order" o on o.id = oi."orderId"
    where oi.id = "orderItemId"
      and (o."userId" = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public."OrderItem" oi
    join public."Order" o on o.id = oi."orderId"
    where oi.id = "orderItemId"
      and (o."userId" = auth.uid() or public.is_admin())
  )
);

drop policy if exists order_item_modifier_delete_owner_or_admin on public."OrderItemModifier";
create policy order_item_modifier_delete_owner_or_admin
on public."OrderItemModifier"
for delete
using (
  exists (
    select 1
    from public."OrderItem" oi
    join public."Order" o on o.id = oi."orderId"
    where oi.id = "orderItemId"
      and (o."userId" = auth.uid() or public.is_admin())
  )
);

drop policy if exists payment_event_admin_read on public."PaymentEvent";
create policy payment_event_admin_read
on public."PaymentEvent"
for select
using (public.is_admin());

drop policy if exists payment_event_admin_insert on public."PaymentEvent";
create policy payment_event_admin_insert
on public."PaymentEvent"
for insert
with check (public.is_admin());

drop policy if exists payment_event_admin_update on public."PaymentEvent";
create policy payment_event_admin_update
on public."PaymentEvent"
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists payment_event_admin_delete on public."PaymentEvent";
create policy payment_event_admin_delete
on public."PaymentEvent"
for delete
using (public.is_admin());

commit;
