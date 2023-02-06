-- Revert ccbc:computed_columns/application_status_order from pg

begin;

drop function ccbc_public.application_status_order(ccbc_public.application);

commit;
