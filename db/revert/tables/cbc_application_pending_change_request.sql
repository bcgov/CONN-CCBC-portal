-- Revert ccbc:tables/cbc_application_pending_change_request from pg

BEGIN;

drop table if exists ccbc_public.cbc_application_pending_change_request;

COMMIT;
