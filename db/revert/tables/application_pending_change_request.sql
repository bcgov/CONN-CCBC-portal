-- Revert ccbc:tables/application_pending_change_request from pg

BEGIN;

drop table if exists ccbc_public.application_pending_change_request;

COMMIT;
