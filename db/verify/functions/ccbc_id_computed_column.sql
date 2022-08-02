-- Verify ccbc:functions/ccbc_id_computed_column on pg

BEGIN;

select pg_get_functiondef('ccbc_public.applications_ccbc_id(ccbc_public.applications)'::regprocedure);

ROLLBACK;
