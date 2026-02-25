-- Revert ccbc:tables/change_log_data from pg

begin;

drop table if exists ccbc_public.change_log_data;

commit;
