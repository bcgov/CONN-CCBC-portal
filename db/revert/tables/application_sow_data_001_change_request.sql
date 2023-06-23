-- Revert ccbc:tables/application_sow_data_001_change_request from pg

begin;

alter table ccbc_public.application_sow_data drop column change_request_number;
alter table ccbc_public.application_sow_data drop column is_change_request;

commit;
