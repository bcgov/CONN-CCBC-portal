-- Revert ccbc:tables/rfi_data_status_type from pg

begin;

drop table ccbc_public.rfi_data_status_type;

commit;
