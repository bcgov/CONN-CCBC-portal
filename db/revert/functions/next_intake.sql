-- Revert ccbc:functions/next_intake from pg

BEGIN;

drop function ccbc_public.next_intake;

COMMIT;
