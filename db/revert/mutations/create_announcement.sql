-- Revert ccbc:mutations/create_announcement from pg

BEGIN;

drop function if exists ccbc_public.create_announcement;

COMMIT;
