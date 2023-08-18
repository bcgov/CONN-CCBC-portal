-- Revert ccbc:mutations/create_application_community_progress_report_data from pg

begin;

drop function if exists ccbc.create_application_community_progress_report_data;

commit;
