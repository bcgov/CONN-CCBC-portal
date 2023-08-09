-- Revert ccbc:tables/application_community_report_excel_data from pg

begin;

drop table ccbc_public.application_community_report_excel_data cascade;

commit;
