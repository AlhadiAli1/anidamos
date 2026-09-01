-- Delivery management tables for Andiamo's
-- Run this in the Supabase SQL editor (once).

-- Delivery agents: each has a username + password + registered WhatsApp phone.
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text not null unique,
  password_hash text not null,
  phone text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Deliveries assigned to an agent.
create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  details text default '',
  price text not null,
  customer_phone text default '',
  agent_id uuid references public.agents (id),
  address text default '',
  delivery_fee integer not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'delivered', 'cancelled')),
  manager_note text default '',
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  delivered_at timestamptz
);

alter table public.deliveries add column if not exists delivery_fee integer not null default 0;

alter table public.agents enable row level security;
alter table public.deliveries enable row level security;

create index if not exists deliveries_created_idx on public.deliveries (created_at desc);
create index if not exists deliveries_agent_idx on public.deliveries (agent_id);
