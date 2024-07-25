-- Revert ccbc:tables/application_announced from pg

BEGIN;

drop table ccbc_public.application_announced;

COMMIT;
