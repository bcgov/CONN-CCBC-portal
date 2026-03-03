-- Deploy ccbc:tables/application_er_001 to pg

begin;

alter table ccbc_public.application_er
  add column id serial primary key,
  alter column ccbc_number type text,
  alter column er type text;

commit;
