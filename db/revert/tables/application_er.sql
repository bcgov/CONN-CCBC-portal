-- Revert ccbc:tables/application_er from pg

BEGIN;

drop table if exists ccbc_public.application_er;

COMMIT;
