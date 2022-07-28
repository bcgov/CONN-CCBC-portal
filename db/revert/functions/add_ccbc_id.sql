-- Revert ccbc:functions/add_ccbc_id from pg

BEGIN;

drop function ccbc_public.applications_add_ccbc_id;

COMMIT;
