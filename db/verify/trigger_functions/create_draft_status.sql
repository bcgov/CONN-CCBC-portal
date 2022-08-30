-- Verify ccbc:trigger_functions/create_draft_status on pg

begin;

select pg_get_functiondef('ccbc_private.create_draft_status()'::regprocedure);

rollback;

