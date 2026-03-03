-- Deploy ccbc:tables/application_rd_001 to pg

begin;

alter table ccbc_public.application_rd
  add column id serial primary key,
  alter column ccbc_number type text,
  alter column rd type text,
  add column er text;

commit;
