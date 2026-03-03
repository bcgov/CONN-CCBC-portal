-- Revert ccbc:tables/application_rd_001 from pg

begin;

alter table ccbc_public.application_rd
  drop column if exists id,
  alter column ccbc_number type varchar(255),
  alter column rd type varchar(255),
  drop column if exists er;

commit;
