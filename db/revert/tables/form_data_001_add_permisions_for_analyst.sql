-- Revert ccbc:tables/form_data_001_add_permisions_for_analyst from pg

begin;

drop policy ccbc_analyst_user_select_form_data on ccbc_public.form_data;

drop policy ccbc_analyst_user_insert_form_data on ccbc_public.form_data;

commit;
