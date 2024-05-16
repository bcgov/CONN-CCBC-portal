-- Revert ccbc:extensions/application_gis_assessment_hh_history from pg
BEGIN;
SELECT
  audit.disable_tracking('ccbc_public.application_gis_assessment_hh'::regclass);
COMMIT;
