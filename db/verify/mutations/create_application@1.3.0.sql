-- Verify ccbc:mutations/create_application on pg

BEGIN;

select pg_get_functiondef('ccbc_public.create_user_from_session()'::regprocedure);

ROLLBACK;
