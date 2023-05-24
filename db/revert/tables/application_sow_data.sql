-- Revert ccbc:tables/application_sow_data from pg

BEGIN;

drop table ccbc_public.application_sow_data;

COMMIT;
