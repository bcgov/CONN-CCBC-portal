-- Deploy ccbc:tables/cbc_application_pending_change_request_001_service_account to pg

BEGIN;

do
$grant$
begin

-- Grant ccbc_service_account permissions
perform ccbc_private.grant_permissions('select', 'cbc_application_pending_change_request', 'ccbc_service_account');
perform ccbc_private.grant_permissions('insert', 'cbc_application_pending_change_request', 'ccbc_service_account');
perform ccbc_private.grant_permissions('update', 'cbc_application_pending_change_request', 'ccbc_service_account');

end
$grant$;

COMMIT;
