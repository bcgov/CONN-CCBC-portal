-- Verify ccbc:trigger_function/update_timestamps on pg

begin;

select pg_get_functiondef('ccbc_private.update_timestamps()'::regprocedure);

rollback;
