-- Deploy ccbc:tables/gis_data_001_add_file_name to pg

BEGIN;

alter table ccbc_public.gis_data add column file_name varchar(1000);

COMMIT;
