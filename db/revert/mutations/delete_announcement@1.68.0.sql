-- Revert ccbc:mutations/delete_announcement from pg

BEGIN;

    drop function if exists ccbc_public.delete_announcement;

COMMIT;
