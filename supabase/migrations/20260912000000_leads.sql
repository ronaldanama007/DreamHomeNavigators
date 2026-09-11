-- Leads CRM table for Dream Home Navigators
create table if not exists public.leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  name              text not null,
  phone             text not null default '',
  email             text not null default '',
  location          text not null default '',
  budget            text not null default '',
  property_interest text not null default '',
  message           text not null default '',
  source            text not null default ''
);

alter table public.leads enable row level security;

-- Public contact form may insert a lead (anon + authenticated), nothing else.
create policy "leads_insert_any"
  on public.leads for insert
  to anon, authenticated
  with check (
    length(name) <= 200 and
    length(phone) <= 60 and
    length(email) <= 200 and
    length(location) <= 200 and
    length(budget) <= 100 and
    length(property_interest) <= 300 and
    length(message) <= 5000 and
    length(source) <= 200
  );

-- Only logged-in admins may read leads. No anon SELECT policy => anon reads return nothing.
create policy "leads_select_authenticated"
  on public.leads for select
  to authenticated
  using (true);

-- Only logged-in admins may delete leads.
create policy "leads_delete_authenticated"
  on public.leads for delete
  to authenticated
  using (true);
