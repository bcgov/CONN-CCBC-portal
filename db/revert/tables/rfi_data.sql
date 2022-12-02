-- Revert ccbc:tables/rfi_data from pg


begin;

drop table ccbc_public.rfi_data;

commit;
