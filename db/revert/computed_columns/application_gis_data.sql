-- Revert ccbc:computed_columns/application_gis_data from pg

BEGIN;

drop function ccbc_public.application_gis_data(ccbc_public.application);

COMMIT;
