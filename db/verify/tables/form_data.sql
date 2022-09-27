-- Verify ccbc:tables/form_data on pg


begin;

select pg_catalog.has_table_privilege('ccbc_public.form_data', 'select');


rollback;
