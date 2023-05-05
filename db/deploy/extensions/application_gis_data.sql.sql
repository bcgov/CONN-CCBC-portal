-- Deploy ccbc:extensions/application_gis_data.sql to pg

BEGIN;

select audit.enable_tracking('ccbc_public.application_gis_data'::regclass);

COMMIT;
