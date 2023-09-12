-- Deploy ccbc:tables/application_milestone_data_001 to pg

begin;

alter table ccbc_public.application_milestone_data add column history_operation varchar(1000) default 'created';

comment on column ccbc_public.application_milestone_data.history_operation is 'History operation';

commit;
