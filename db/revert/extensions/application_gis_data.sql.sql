-- Revert ccbc:extensions/application_gis_data.sql from pg

BEGIN;

select audit.disable_tracking('ccbc_public.application_gis_data'::regclass);

COMMIT;
