-- Revert ccbc:tables/application_status from pg

BEGIN;

drop table if exists ccbc_public.application_status cascade;

COMMIT;
