-- Revert ccbc:mutations/save_gis_data from pg

BEGIN;

    drop function ccbc_public.save_gis_data;

COMMIT;
