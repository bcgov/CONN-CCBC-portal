-- Revert ccbc:import/set_application_status_archived from pg

BEGIN;

drop function ccbc_public.set_application_status_archived;

COMMIT;
