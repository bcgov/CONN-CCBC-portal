-- Verify ccbc:util_functions/grant_permissions on pg

begin;

select pg_get_functiondef('ccbc_public.grant_permissions(text, text, text, text)'::regprocedure);
select pg_get_functiondef('ccbc_public.grant_permissions(text, text, text, text[], text)'::regprocedure);

rollback;
