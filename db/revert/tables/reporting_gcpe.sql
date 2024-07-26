-- Revert ccbc:tables/reporting_gcpe from pg

BEGIN;

drop table if exists ccbc_public.reporting_gcpe;

COMMIT;
