-- Revert ccbc:mutations/create_pending_change_request from pg

BEGIN;

drop function if exists ccbc_public.create_pending_change_request(_is_pending boolean, _application_id int, _cbc_id int, _comment varchar);

COMMIT;
