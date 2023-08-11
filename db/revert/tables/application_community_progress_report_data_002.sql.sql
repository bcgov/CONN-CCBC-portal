-- Revert ccbc:tables/application_community_progress_report_data_002.sql from pg

begin;

alter table ccbc_public.application_community_progress_report_data drop column if exists excel_data_id;

commit;
