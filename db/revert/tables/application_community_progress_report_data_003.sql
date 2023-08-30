-- Revert ccbc:tables/application_community_progress_report_data_003 to pg

begin;

alter table ccbc_public.application_community_progress_report_data drop column history_operation;

commit;
