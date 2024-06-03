-- Revert ccbc:tables/cbc_data_change_reason from pg

begin;

drop table ccbc_public.cbc_data_change_reason;

commit;
