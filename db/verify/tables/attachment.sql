-- Verify ccbc:tables/attachment on pg

BEGIN;

select pg_catalog.has_table_privilege('ccbc_public.attachment', 'select');

ROLLBACK;
