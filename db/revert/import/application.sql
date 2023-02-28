-- Revert ccbc:import/application from pg

BEGIN;

drop function ccbc_public.import_applications;

COMMIT;
