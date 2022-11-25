-- deploy ccbc:form_data_004_sequence_permissions_analyst to pg

begin;

grant usage, select on sequence ccbc_public.form_data_id_seq to ccbc_analyst;

grant usage, select on sequence ccbc_public.form_data_id_seq to ccbc_admin;

do
$change_rls$
begin

drop policy if exists ccbc_analyst_user_insert_form_data on ccbc_public.form_data;

drop policy if exists ccbc_admin_user_insert_form_data on ccbc_public.form_data;

perform ccbc_private.upsert_policy('ccbc_analyst_user_insert_form_data', 'form_data',
'insert', 'ccbc_analyst', '(true)');

perform ccbc_private.upsert_policy('ccbc_admin_user_insert_form_data', 'form_data',
'insert', 'ccbc_admin', '(true)');

end
$change_rls$;

commit;
