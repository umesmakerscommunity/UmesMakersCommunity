-- Politicas RLS para contenido administrable.
-- Ejecutar manualmente en Supabase SQL Editor.
-- Admin autorizado: umesmakerscommunity@gmail.com
-- No toca politicas de events.

alter table public.projects enable row level security;
alter table public.makers enable row level security;
alter table public.tools enable row level security;
alter table public.resources enable row level security;

grant usage on schema public to anon, authenticated;

grant select on table public.projects to anon, authenticated;
grant select on table public.makers to anon, authenticated;
grant select on table public.tools to anon, authenticated;
grant select on table public.resources to anon, authenticated;

grant insert, update, delete on table public.projects to authenticated;
grant insert, update, delete on table public.makers to authenticated;
grant insert, update, delete on table public.tools to authenticated;
grant insert, update, delete on table public.resources to authenticated;

drop policy if exists "public_select_published_projects" on public.projects;
create policy "public_select_published_projects"
on public.projects
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "admin_select_projects" on public.projects;
create policy "admin_select_projects"
on public.projects
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_insert_projects" on public.projects;
create policy "admin_insert_projects"
on public.projects
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_update_projects" on public.projects;
create policy "admin_update_projects"
on public.projects
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com')
with check ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_delete_projects" on public.projects;
create policy "admin_delete_projects"
on public.projects
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "public_select_published_makers" on public.makers;
create policy "public_select_published_makers"
on public.makers
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "admin_select_makers" on public.makers;
create policy "admin_select_makers"
on public.makers
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_insert_makers" on public.makers;
create policy "admin_insert_makers"
on public.makers
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_update_makers" on public.makers;
create policy "admin_update_makers"
on public.makers
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com')
with check ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_delete_makers" on public.makers;
create policy "admin_delete_makers"
on public.makers
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "public_select_published_tools" on public.tools;
create policy "public_select_published_tools"
on public.tools
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "admin_select_tools" on public.tools;
create policy "admin_select_tools"
on public.tools
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_insert_tools" on public.tools;
create policy "admin_insert_tools"
on public.tools
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_update_tools" on public.tools;
create policy "admin_update_tools"
on public.tools
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com')
with check ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_delete_tools" on public.tools;
create policy "admin_delete_tools"
on public.tools
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "public_select_published_resources" on public.resources;
create policy "public_select_published_resources"
on public.resources
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "admin_select_resources" on public.resources;
create policy "admin_select_resources"
on public.resources
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_insert_resources" on public.resources;
create policy "admin_insert_resources"
on public.resources
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_update_resources" on public.resources;
create policy "admin_update_resources"
on public.resources
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com')
with check ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_delete_resources" on public.resources;
create policy "admin_delete_resources"
on public.resources
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');
