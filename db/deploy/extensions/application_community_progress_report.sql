-- Deploy ccbc:extensions/application_community_progress_report to pg

BEGIN;

    select audit.enable_tracking('ccbc_public.application_community_progress_report_data'::regclass);

COMMIT;
