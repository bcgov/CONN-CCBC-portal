-- Revert ccbc:functions/open_intake_public from pg

BEGIN;

drop function ccbc_public.open_intake_public;

COMMIT;
