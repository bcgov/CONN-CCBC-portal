-- Revert ccbc:functions/ccbc_id_computed_column from pg

BEGIN;

drop function ccbc_public.applications_ccbc_id;

COMMIT;
