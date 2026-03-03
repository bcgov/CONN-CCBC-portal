-- Revert ccbc:tables/application_er_001 from pg

begin;

alter table ccbc_public.application_er
  drop column if exists id,
  alter column ccbc_number type varchar(255),
  alter column er type varchar(255);

commit;
