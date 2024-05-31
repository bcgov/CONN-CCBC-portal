-- Revert ccbc:mutations/create_cbc_pending_change_request from pg

BEGIN;

drop function ccbc_public.create_cbc_pending_change_request;

COMMIT;
