-- Revert ccbc:tables/application from pg

begin;

drop table ccbc_public.application;

commit;
