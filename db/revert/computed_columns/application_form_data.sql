-- Revert ccbc:computed_columns/application_form_data from pg

begin;

drop function ccbc_public.application_form_data;

commit;
