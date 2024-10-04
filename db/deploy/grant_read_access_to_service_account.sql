-- Deploy ccbc:grant_read_access_to_service_account to pg

BEGIN;

grant execute on function ccbc_public.application_organization_name to ccbc_service_account;
grant execute on function ccbc_public.application_project_name to ccbc_service_account;
grant execute on function ccbc_public.application_form_data to ccbc_service_account;

do
$grant_service$
begin

-- table grants
perform ccbc_private.grant_permissions('select', 'application', 'ccbc_service_account');
perform ccbc_private.grant_permissions('select', 'application_form_data', 'ccbc_service_account');
perform ccbc_private.grant_permissions('select', 'form_data', 'ccbc_service_account');
perform ccbc_private.grant_permissions('select', 'form', 'ccbc_service_account');
perform ccbc_private.grant_permissions('select', 'analyst', 'ccbc_service_account');
perform ccbc_private.grant_permissions('select', 'application_sow_data', 'ccbc_service_account');
perform ccbc_private.grant_permissions('select', 'sow_tab_2', 'ccbc_service_account');

-- RLS
perform ccbc_private.upsert_policy('ccbc_service_account_select_application', 'application', 'select', 'ccbc_service_account', 'true');
perform ccbc_private.upsert_policy('ccbc_service_account_select_application_form_data', 'application_form_data', 'select', 'ccbc_service_account', 'true');
perform ccbc_private.upsert_policy('ccbc_service_account_select_form_data', 'application_form_data', 'select', 'ccbc_service_account', 'true');

end
$grant_service$;

COMMIT;
