-- Revert ccbc:types/assessment_form_result from pg
BEGIN;

DROP TYPE IF EXISTS ccbc_public.assessment_form_result;

COMMIT;
