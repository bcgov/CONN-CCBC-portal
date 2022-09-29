-- Revert ccbc:computed_columns/application_form_data_id from pg

begin;

drop function ccbc_public.application_form_data_id;

commit;
