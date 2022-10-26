-- Revert ccbc:tables/application_form_data_001_add_rls_for_analyst from pg

begin;

drop policy ccbc_analyst_select_received_form_data on ccbc_public.application_form_data;

drop policy ccbc_analyst_insert_new_received_form_data on ccbc_public.application_form_data;

drop policy ccbc_admin_select_received_form_data on ccbc_public.application_form_data;

drop policy ccbc_admin_insert_new_received_form_data on ccbc_public.application_form_data;

commit;
