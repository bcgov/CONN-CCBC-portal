-- Revert ccbc:tables/application_rd from pg

BEGIN;

drop table if exists ccbc_public.application_rd;

COMMIT;
