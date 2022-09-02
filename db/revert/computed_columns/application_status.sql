-- Revert ccbc:computed_columns/application_status from pg

begin;

drop function ccbc_public.application_status;

commit;
