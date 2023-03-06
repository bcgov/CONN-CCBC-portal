-- Revert ccbc:import/application_package from pg

BEGIN;

drop function ccbc_public.import_application_packages;

COMMIT;
