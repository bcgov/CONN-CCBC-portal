-- Revert ccbc:tables/application_package from pg

begin;

drop table ccbc_public.application_package;

commit;
