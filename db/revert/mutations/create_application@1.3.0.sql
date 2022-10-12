-- Revert ccbc:mutations/create_application from pg

BEGIN;

drop function ccbc_public.create_application;

COMMIT;
