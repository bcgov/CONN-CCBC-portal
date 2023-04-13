-- Revert ccbc:computed_columns/application_external_status from pg

begin;

drop function ccbc_public.application_external_status;

commit;
