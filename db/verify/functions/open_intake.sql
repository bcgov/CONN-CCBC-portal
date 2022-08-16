-- Verify ccbc:functions/open_intake on pg

BEGIN;

select pg_get_functiondef('ccbc_public.open_intake()'::regprocedure);

ROLLBACK;
