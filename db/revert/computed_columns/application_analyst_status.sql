-- Revert ccbc:computed_columns/application_analyst_status from pg

begin;

drop function ccbc_public.application_analyst_status;

commit;
