-- Revert ccbc:tables/change_request_data_001_amendment from pg

begin;

alter table ccbc_public.change_request_data add column change_request_number integer;
alter table ccbc_public.change_request_data drop column amendment_number;

commit;
