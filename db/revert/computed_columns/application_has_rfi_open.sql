-- revert ccbc:computed_columns/application_has_rfi_open from pg

begin;

drop function ccbc_public.application_has_rfi_open;

commit;
