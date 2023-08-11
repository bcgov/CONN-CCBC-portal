-- Deploy ccbc:tables/application_community_progress_report_data_002.sql to pg

begin;

alter table ccbc_public.application_community_progress_report_data add column excel_data_id integer;

comment on column ccbc_public.application_community_progress_report_data.excel_data_id is 'The id of the excel data that this record is associated with';

commit;
