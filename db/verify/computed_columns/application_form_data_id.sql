-- Verify ccbc:computed_columns/application_form_data_id on pg

begin;

select pg_get_functiondef('ccbc_public.application_form_data_id(ccbc_public.application)'::regprocedure);

rollback;
