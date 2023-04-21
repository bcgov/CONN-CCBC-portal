-- Revert ccbc:tables/application_announcement from pg

BEGIN;

    drop table if exists ccbc_public.application_announcement;

COMMIT;