alter table public.orders
  add column if not exists payment_method text not null default 'whatsapp',
  add column if not exists payment_status text not null default 'received',
  add column if not exists credits_amount numeric(12, 2),
  add column if not exists idempotency_key text,
  add column if not exists items jsonb;

create index if not exists orders_payment_status_idx on public.orders (payment_status);
create index if not exists orders_customer_id_idx on public.orders (customer_id);

update public.orders
set payment_status = 'received'
where payment_status is null;
