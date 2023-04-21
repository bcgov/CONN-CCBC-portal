-- Revert ccbc:tables/announcement from pg

BEGIN;

    drop table if exists ccbc_public.announcement;

COMMIT;
