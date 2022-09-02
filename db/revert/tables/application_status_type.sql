-- Revert ccbc:tables/application_status_type from pg

BEGIN;

drop table ccbc_public.application_status_type;

COMMIT;
