-- Deploy ccbc:tables/application_form_template_9_data_001_add_missing_roles to pg

BEGIN;

do
$grant$
begin

-- Grant cbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_form_template_9_data', 'cbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_form_template_9_data', 'cbc_admin');
perform ccbc_private.grant_permissions('update', 'application_form_template_9_data', 'cbc_admin');

-- Grant analyst account permissions
perform ccbc_private.grant_permissions('select', 'application_form_template_9_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_form_template_9_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_form_template_9_data', 'ccbc_analyst');

-- Grant super_admin account permissions
perform ccbc_private.grant_permissions('select', 'application_form_template_9_data', 'super_admin');
perform ccbc_private.grant_permissions('insert', 'application_form_template_9_data', 'super_admin');
perform ccbc_private.grant_permissions('update', 'application_form_template_9_data', 'super_admin');

end
$grant$;

COMMIT;
