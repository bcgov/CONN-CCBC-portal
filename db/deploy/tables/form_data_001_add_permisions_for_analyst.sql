-- Deploy ccbc:tables/form_data_001_add_permisions_for_analyst to pg

begin;

do
$$
begin

perform ccbc_private.upsert_policy('ccbc_analyst_user_select_form_data', 'form_data',
'select','ccbc_analyst', 'id in (select form_data_id from ccbc_public.application_form_data');
-- An analyst can only create form data for an existing application
perform ccbc_private.upsert_policy('ccbc_analyst_user_insert_form_data', 'form_data',
'insert', 'ccbc_analyst', 'id in (select form_data_id from ccbc_public.application_form_data');

end
$$;

commit;
