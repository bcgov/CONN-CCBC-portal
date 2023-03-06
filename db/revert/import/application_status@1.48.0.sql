-- Revert ccbc:import/application_status from pg

BEGIN;

drop function ccbc_public.import_application_statuses;

COMMIT;
