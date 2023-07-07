-- Deploy ccbc:tables/change_request_data_001_amendment to pg

begin;

alter table ccbc_public.change_request_data add column amendment_number integer;
alter table ccbc_public.change_request_data drop column change_request_number;

commit;
