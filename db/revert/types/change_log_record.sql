-- Revert ccbc:types/change_log_record from pg

begin;

drop type ccbc_public.change_log_record;

commit;
