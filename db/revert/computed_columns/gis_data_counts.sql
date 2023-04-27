-- Revert ccbc:computed_columns/gis_data_counts from pg

BEGIN;

drop function if exists ccbc_public.gis_data_counts;

COMMIT;
