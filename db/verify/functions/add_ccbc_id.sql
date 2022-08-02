-- Verify ccbc:functions/add_ccbc_id on pg

BEGIN;

select pg_get_functiondef('ccbc_public.applications_add_ccbc_id(integer)'::regprocedure);

ROLLBACK;
