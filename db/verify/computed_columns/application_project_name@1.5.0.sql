-- Verify ccbc:computed_columns/application_project_name on pg

begin;

select pg_get_functiondef('ccbc_public.application_project_name(ccbc_public.application)'::regprocedure);

rollback;
