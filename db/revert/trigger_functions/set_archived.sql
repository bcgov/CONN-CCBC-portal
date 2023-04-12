-- Revert ccbc:trigger_functions/set_archived from pg

BEGIN;

drop function ccbc_private.set_archived;

COMMIT;
