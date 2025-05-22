-- Revert ccbc:mutations/archive_application_change_request from pg

BEGIN;

DROP FUNCTION IF EXISTS ccbc_public.archive_application_change_request(
    p_application_id INTEGER,
    p_amendment_number INTEGER
);

COMMIT;
