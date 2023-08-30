-- Revert ccbc:import/application_community_progress_report from pg

BEGIN;

drop function ccbc_public.import_application_community_progress_report_records;

COMMIT;
