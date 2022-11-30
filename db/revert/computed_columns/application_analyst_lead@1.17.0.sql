-- Revert ccbc:computed_columns/application_analyst_lead from pg

begin;

drop function ccbc_public.application_analyst_lead;

commit;
