-- Revert ccbc:functions/open_intake from pg

BEGIN;

drop function ccbc_public.open_intake;

COMMIT;
