-- Revert ccbc:tables/notification from pg

BEGIN;

drop table ccbc_public.notification;

COMMIT;
