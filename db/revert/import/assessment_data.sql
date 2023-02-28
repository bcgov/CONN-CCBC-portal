-- Revert ccbc:import/assessment_data from pg

BEGIN;

drop function ccbc_public.import_assessment_data;

COMMIT;
