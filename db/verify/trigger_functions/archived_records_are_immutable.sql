-- Verify ccbc:trigger_functions/archived_records_are_immutable on pg

begin;

select pg_get_functiondef('ccbc_private.archived_records_are_immutable()'::regprocedure);

rollback;
