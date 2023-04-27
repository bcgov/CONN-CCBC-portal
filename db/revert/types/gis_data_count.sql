-- Revert ccbc:types/gis_data_count from pg

BEGIN;

drop type if exists ccbc_public.gis_data_count cascade;

COMMIT;
