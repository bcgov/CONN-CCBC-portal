-- Revert ccbc:tables/application_community_progress_report_data from pg

BEGIN;

drop table if exists ccbc_public.application_community_progress_report_data cascade;

COMMIT;
