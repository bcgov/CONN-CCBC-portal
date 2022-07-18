-- Verify ccbc:functions/expose_application_name on pg

BEGIN;

select pg_get_functiondef('ccbc_public.applications_project_name(ccbc_public.applications)'::regprocedure);

ROLLBACK;
