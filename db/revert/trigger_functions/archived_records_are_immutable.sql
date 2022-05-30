-- Revert ccbc:trigger_functions/archived_records_are_immutable from pg

begin;

drop function ccbc_private.archived_records_are_immutable;

COMMIT;
