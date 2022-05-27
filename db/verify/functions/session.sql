-- Verify ccbc:function/session on pg

begin;

select pg_get_functiondef('ccbc_public.session()'::regprocedure);

rollback;
