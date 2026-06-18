-- Esquema y politicas RLS para registros de nuevos miembros.
-- Ejecutar manualmente en Supabase SQL Editor.
-- Admin autorizado: umesmakerscommunity@gmail.com
-- No usa service_role ni secret keys.

create extension if not exists "pgcrypto";

create table if not exists public.member_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  career text,
  semester text,
  interest_area text,
  email text not null,
  phone text,
  comment text,
  status text default 'nuevo',
  notes text,
  is_archived boolean default false
);

alter table public.member_registrations enable row level security;

grant usage on schema public to anon, authenticated;

grant insert on table public.member_registrations to anon, authenticated;
grant select, update, delete on table public.member_registrations to authenticated;

drop policy if exists "public_insert_member_registrations" on public.member_registrations;
create policy "public_insert_member_registrations"
on public.member_registrations
for insert
to anon, authenticated
with check (true);

drop policy if exists "admin_select_member_registrations" on public.member_registrations;
create policy "admin_select_member_registrations"
on public.member_registrations
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_update_member_registrations" on public.member_registrations;
create policy "admin_update_member_registrations"
on public.member_registrations
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com')
with check ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');

drop policy if exists "admin_delete_member_registrations" on public.member_registrations;
create policy "admin_delete_member_registrations"
on public.member_registrations
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'umesmakerscommunity@gmail.com');
