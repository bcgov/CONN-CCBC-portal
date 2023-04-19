-- Revert ccbc:trigger_functions/set_archived from pg

BEGIN;

drop function if exists ccbc_private.set_archived cascade;

COMMIT;
