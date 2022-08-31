-- Verify ccbc:mutations/set_current_date on pg

begin;

select pg_get_functiondef('ccbc_public.set_current_date(timestamptz)'::regprocedure);

rollback;
