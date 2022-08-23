-- Verify ccbc:trigger_functions/create_intake_sequence on pg

begin;

select pg_get_functiondef('ccbc_private.create_intake_sequence()'::regprocedure);

rollback;
