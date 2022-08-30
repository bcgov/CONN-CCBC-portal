-- Revert ccbc:trigger_functions/create_draft_status from pg

BEGIN;

drop function ccbc_private.create_draft_status;

COMMIT;
