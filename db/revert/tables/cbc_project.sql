-- Revert ccbc:tables/cbc_project from pg

begin;

drop table if exists ccbc_public.cbc_project cascade;

commit;
