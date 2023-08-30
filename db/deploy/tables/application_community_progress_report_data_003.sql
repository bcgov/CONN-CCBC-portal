-- Deploy ccbc:tables/application_community_progress_report_data_003 to pg

begin;

alter table ccbc_public.application_community_progress_report_data add column history_operation varchar(1000) default 'created';

comment on column ccbc_public.application_community_progress_report_data.history_operation is 'History operation';

commit;
