-- Shared site content: properties (for-sale + rental), services, and singletons
-- (about, featured). Publicly READABLE (the public site renders from these);
-- only signed-in admins may write. Each row keeps the app's typed object in
-- `data jsonb` so the TypeScript shapes (Property / ServiceItem / AboutContent)
-- stay intact.

create table if not exists public.properties (
  id         text primary key,
  category   text not null check (category in ('sale','rental')),
  sort       int  not null default 0,
  updated_at timestamptz not null default now(),
  data       jsonb not null
);
create index if not exists properties_category_sort_idx on public.properties (category, sort);

create table if not exists public.services (
  id         text primary key,
  sort       int  not null default 0,
  updated_at timestamptz not null default now(),
  data       jsonb not null
);

create table if not exists public.site_content (
  key        text primary key,
  updated_at timestamptz not null default now(),
  data       jsonb not null
);

alter table public.properties   enable row level security;
alter table public.services     enable row level security;
alter table public.site_content enable row level security;

-- Public read for everyone (anon + authenticated).
create policy "properties_read"   on public.properties   for select to anon, authenticated using (true);
create policy "services_read"     on public.services     for select to anon, authenticated using (true);
create policy "site_content_read" on public.site_content for select to anon, authenticated using (true);

-- Writes (insert/update/delete) restricted to signed-in admins.
create policy "properties_write"   on public.properties   for all to authenticated using (true) with check (true);
create policy "services_write"     on public.services     for all to authenticated using (true) with check (true);
create policy "site_content_write" on public.site_content for all to authenticated using (true) with check (true);
