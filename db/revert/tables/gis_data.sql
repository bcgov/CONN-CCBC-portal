-- Revert ccbc:tables/gis_data from pg

BEGIN;

drop table ccbc_public.gis_data;

COMMIT;
