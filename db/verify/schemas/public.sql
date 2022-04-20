-- Verify ccbc:schemas/public on pg

begin;

select pg_catalog.has_schema_privilege('ccbc_public', 'usage');

rollback;
