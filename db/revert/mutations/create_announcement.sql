-- Revert ccbc:mutations/create_announcement_record from pg

BEGIN;

drop function if exists ccbc_public.create_announcement_record;

COMMIT;
