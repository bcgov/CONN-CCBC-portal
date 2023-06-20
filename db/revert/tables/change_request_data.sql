-- Revert ccbc:tables/change_request_data from pg

begin;

drop table ccbc_public.change_request_data;

commit;
