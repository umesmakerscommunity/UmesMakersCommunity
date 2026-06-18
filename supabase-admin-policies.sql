-- Politicas RLS para administrar eventos desde el panel web.
-- Reemplaza TU_CORREO_ADMIN por el correo del usuario creado en Supabase Authentication.
-- No uses service_role ni secret keys en el frontend.

alter table public.events enable row level security;

grant usage on schema public to anon, authenticated;
grant select on table public.events to anon;
grant select, insert, update, delete on table public.events to authenticated;

drop policy if exists "admin_select_events" on public.events;
drop policy if exists "admin_insert_events" on public.events;
drop policy if exists "admin_update_events" on public.events;
drop policy if exists "admin_delete_events" on public.events;

create policy "admin_select_events"
on public.events
for select
to authenticated
using (
  (auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com'
);

create policy "admin_insert_events"
on public.events
for insert
to authenticated
with check (
  (auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com'
);

create policy "admin_update_events"
on public.events
for update
to authenticated
using (
  (auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com'
)
with check (
  (auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com'
);

create policy "admin_delete_events"
on public.events
for delete
to authenticated
using (
  (auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com'
);