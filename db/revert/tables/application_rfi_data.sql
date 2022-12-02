-- Revert ccbc:tables/application_rfi_data from pg

begin;

drop table ccbc_public.application_rfi_data cascade;

commit;
