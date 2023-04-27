-- Revert ccbc:types/gis_data_item from pg

BEGIN;
drop type ccbc_public.gis_data_item cascade;

COMMIT;
