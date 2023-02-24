-- Revert ccbc:import/rfi_data from pg

BEGIN;

drop function ccbc_public.import_rfi_data;

COMMIT;
