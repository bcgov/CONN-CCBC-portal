-- Verify ccbc:mutations/create_user_from_session on pg

begin;

select pg_get_functiondef('ccbc_public.create_user_from_session()'::regprocedure);

rollback;
