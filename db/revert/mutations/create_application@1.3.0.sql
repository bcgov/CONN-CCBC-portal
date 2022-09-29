-- Revert ccbc:mutations/create_application from pg

BEGIN;

drop function ccbc.create_application;

COMMIT;
