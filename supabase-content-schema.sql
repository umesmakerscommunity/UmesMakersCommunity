-- Esquema para contenido administrable de UMES Makers Community.
-- Ejecutar manualmente en Supabase SQL Editor.
-- No toca la tabla events.

create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  slug text unique not null,
  name text not null,
  status text,
  updated_label text,
  featured boolean default false,
  image_url text,
  summary text,
  technologies jsonb default '[]'::jsonb,
  components jsonb default '[]'::jsonb,
  documentation_url text,
  repository_url text,
  designs_url text,
  objective text,
  source text,
  build_steps jsonb default '[]'::jsonb,
  results jsonb default '[]'::jsonb,
  improvements jsonb default '[]'::jsonb,
  sort_order integer default 0,
  is_published boolean default true
);

create table if not exists public.makers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  initials text,
  area text,
  bio text,
  github_url text,
  linkedin_url text,
  badges jsonb default '[]'::jsonb,
  sort_order integer default 0,
  is_published boolean default true
);

create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  category text,
  availability text,
  quantity integer default 0,
  recommended_use text,
  sort_order integer default 0,
  is_published boolean default true
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  category text,
  type text,
  summary text,
  url text,
  sort_order integer default 0,
  is_published boolean default true
);

create index if not exists projects_is_published_sort_idx
  on public.projects (is_published, sort_order, created_at);

create index if not exists projects_slug_idx
  on public.projects (slug);

create index if not exists makers_is_published_sort_idx
  on public.makers (is_published, sort_order, created_at);

create index if not exists tools_is_published_category_sort_idx
  on public.tools (is_published, category, sort_order, created_at);

create index if not exists resources_is_published_category_sort_idx
  on public.resources (is_published, category, sort_order, created_at);
