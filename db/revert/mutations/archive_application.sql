-- Revert ccbc:mutations/archive_application from pg

BEGIN;

drop function if exists ccbc_public.archive_application;

COMMIT;
