-- Verify ccbc:tables/applications on pg

begin;

select pg_catalog.has_table_privilege('ccbc_public.applications', 'select');


rollback;
