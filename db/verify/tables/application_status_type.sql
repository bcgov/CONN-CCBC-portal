-- Verify ccbc:tables/application_status_type on pg

begin;

select pg_catalog.has_table_privilege('ccbc_public.application_status_type', 'select');

rollback;
