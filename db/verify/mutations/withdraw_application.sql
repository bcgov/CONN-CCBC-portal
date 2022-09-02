-- Verify ccbc:mutations/withdraw_application on pg

begin;

select pg_get_functiondef('ccbc_public.withdraw_application(int)'::regprocedure);

rollback;
