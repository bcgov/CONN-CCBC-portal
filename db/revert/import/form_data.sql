-- Revert ccbc:import/form_data from pg

BEGIN;

drop function ccbc_public.import_form_data;

COMMIT;
