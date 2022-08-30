-- Revert ccbc:functions/expose_application_name from pg

BEGIN;

drop function ccbc_public.application_project_name;

COMMIT;
