-- Revert ccbc:import/application_analyst_lead from pg

BEGIN;

drop function ccbc_public.import_application_analyst_lead;

COMMIT;
