-- Revert ccbc:trigger_functions/update_timestamps from pg

begin;

drop function ccbc_private.update_timestamps;

commit;
