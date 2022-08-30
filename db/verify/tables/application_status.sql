-- Verify ccbc:tables/application_status on pg

begin;

select pg_catalog.has_table_privilege('ccbc_public.application_status', 'select');

rollback;
