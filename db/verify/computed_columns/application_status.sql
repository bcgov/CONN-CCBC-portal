-- Verify ccbc:computed_columns/application_status on pg
begin;

select pg_get_functiondef('ccbc_public.application_status(ccbc_public.application)'::regprocedure);

rollback;
