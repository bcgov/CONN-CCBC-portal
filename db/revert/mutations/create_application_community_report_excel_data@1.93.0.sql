-- Revert ccbc:mutations/create_application_community_report_excel_data from pg

begin;

drop function if exists ccbc.create_application_community_report_excel_data;

commit;
