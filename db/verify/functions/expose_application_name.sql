-- Verify ccbc:functions/expose_application_name on pg

BEGIN;

select pg_get_functiondef('ccbc_public.application_project_name(ccbc_public.application)'::regprocedure);

ROLLBACK;
