-- Deploy ccbc:tables/cbc_project_001_grant_service_account_permissions to pg

BEGIN;

do
$grant$
begin

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'cbc_project', 'ccbc_service_account');
perform ccbc_private.grant_permissions('insert', 'cbc_project', 'ccbc_service_account');
perform ccbc_private.grant_permissions('update', 'cbc_project', 'ccbc_service_account');

end
$grant$;

COMMIT;
