-- Deploy ccbc:tables/application_sow_data_001_change_request to pg

begin;

alter table ccbc_public.application_sow_data add column change_request_number integer default 0;
alter table ccbc_public.application_sow_data add column is_change_request boolean default false;

comment on column ccbc_public.application_sow_data.change_request_number is 'The change request number';
comment on column ccbc_public.application_sow_data.is_change_request is 'Column identifying if the record is a change request';

commit;
