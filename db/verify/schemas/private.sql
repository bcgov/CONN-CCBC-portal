-- Verify ccbc:schemas/private on pg

begin;

select pg_catalog.has_schema_privilege('ccbc_private', 'usage');

rollback;
