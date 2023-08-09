-- Revert ccbc:tables/application_community_report_excel_data from pg

begin;

drop table if exists ccbc_public.application_community_report_excel_data cascade;

commit;
