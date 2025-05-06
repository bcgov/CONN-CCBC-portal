-- Revert ccbc:tables/gis_data_001_add_file_name from pg

BEGIN;

alter table ccbc_public.gis_data drop column if exists file_name;

COMMIT;
