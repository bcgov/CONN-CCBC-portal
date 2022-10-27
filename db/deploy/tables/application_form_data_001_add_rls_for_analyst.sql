-- Deploy ccbc:tables/application_form_data_001_add_rls_for_analyst to pg

begin;

do
$$
begin
perform ccbc_private.grant_permissions('select', 'application_form_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_form_data', 'ccbc_analyst');

perform ccbc_private.grant_permissions('select', 'application_form_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_form_data', 'ccbc_admin');

-- the application table rls prevents an analyst from seeing non-received applications
perform ccbc_private.upsert_policy('ccbc_analyst_select_received_form_data',
'application_form_data','select', 'ccbc_analyst', 'application_id in (select id from ccbc_public.application)');

perform ccbc_private.upsert_policy('ccbc_analyst_insert_new_received_form_data',
'application_form_data','insert', 'ccbc_analyst', 'application_id in (select id from ccbc_public.application)');

perform ccbc_private.upsert_policy('ccbc_admin_select_received_form_data',
'application_form_data','select', 'ccbc_admin', 'application_id in (select id from ccbc_public.application)');

perform ccbc_private.upsert_policy('ccbc_admin_insert_new_received_form_data',
'application_form_data','insert', 'ccbc_admin', 'application_id in (select id from ccbc_public.application)');
end
$$;

commit;
