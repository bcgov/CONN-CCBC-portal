-- Verify ccbc:tables/application_form_data on pg

begin;

select pg_catalog.has_table_privilege('ccbc_public.application_form_data', 'select');

rollback;
