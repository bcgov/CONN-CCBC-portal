-- Verify ccbc:tables/form_data_status_type on pg


begin;

select pg_catalog.has_table_privilege('ccbc_public.form_data_status_type', 'select');


rollback;
