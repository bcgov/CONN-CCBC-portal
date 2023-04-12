-- Revert ccbc:mutations/parse_gis_data from pg

BEGIN;

    drop function ccbc_public.parse_gis_data;

COMMIT;
