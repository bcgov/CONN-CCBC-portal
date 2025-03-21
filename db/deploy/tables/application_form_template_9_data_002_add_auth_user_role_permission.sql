-- Deploy ccbc:tables/application_form_template_9_data_002_add_auth_user_role_permission to pg

begin;

do
$grant$
begin

perform ccbc_private.grant_permissions('select',  'application_form_template_9_data', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('insert',  'application_form_template_9_data', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('update',  'application_form_template_9_data', 'ccbc_auth_user');

end
$grant$;

commit;
