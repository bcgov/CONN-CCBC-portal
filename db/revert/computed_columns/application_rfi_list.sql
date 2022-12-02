-- Revert ccbc:computed_columns/application_rfi_list from pg

begin;

drop function ccbc_public.application_rfi_list;

commit;
