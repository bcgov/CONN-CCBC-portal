-- Revert ccbc:trigger_functions/create_intake_sequence from pg

begin;

drop function ccbc_private.create_intake_sequence;

commit;
