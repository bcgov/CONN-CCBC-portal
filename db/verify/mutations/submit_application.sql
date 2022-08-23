-- Verify ccbc:mutations/submit_application on pg

begin;

select pg_get_functiondef('ccbc_public.submit_application(int)'::regprocedure);

rollback;
