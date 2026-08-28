alter table public.customers
  add column if not exists phone_nb text;

create unique index if not exists customers_phone_nb_idx
  on public.customers (phone_nb)
  where phone_nb is not null;