-- Revert ccbc:tables/application_status from pg

BEGIN;

drop table ccbc_public.application_status;

COMMIT;
