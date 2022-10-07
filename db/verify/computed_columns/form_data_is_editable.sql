-- Verify ccbc:computed_columns/form_data_is_editable on pg

begin;

select pg_get_functiondef('ccbc_public.form_data_is_editable(ccbc_public.form_data)'::regprocedure);

rollback;
