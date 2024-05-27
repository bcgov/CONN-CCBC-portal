-- Revert ccbc:tables/application_pending_change_request_cbc_id from pg

BEGIN;

alter table ccbc_public.application_pending_change_request drop column cbc_id;

COMMIT;
