-- Revert ccbc:tables/application_gis_data from pg

BEGIN;

    drop table ccbc_public.application_gis_data;

COMMIT;
