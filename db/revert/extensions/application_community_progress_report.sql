-- Revert ccbc:extensions/application_community_progress_report from pg

BEGIN;

    select audit.disable_tracking('ccbc_public.application_community_progress_report_data'::regclass);

COMMIT;
