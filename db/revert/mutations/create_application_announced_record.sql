-- Revert ccbc:mutations/create_application_announced_record from pg

BEGIN;

drop function if exists ccbc_public.create_application_announced_record;

COMMIT;
