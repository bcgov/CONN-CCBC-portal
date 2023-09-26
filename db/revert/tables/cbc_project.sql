-- Revert ccbc:tables/cbc_project from pg

begin;

drop table if exists cbc_project cascade;

commit;
