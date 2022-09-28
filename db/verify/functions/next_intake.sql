-- Verify ccbc:functions/next_intake on pg

BEGIN;

select pg_get_functiondef('ccbc_public.next_intake()'::regprocedure);


ROLLBACK;
