-- Deploy ccbc:tables/communities_source_data_001_service_account to pg

BEGIN;

do
$grant$
begin

-- Grant ccbc_service_account permissions
perform ccbc_private.grant_permissions('select', 'communities_source_data', 'ccbc_service_account');
perform ccbc_private.grant_permissions('insert', 'communities_source_data', 'ccbc_service_account');
perform ccbc_private.grant_permissions('update', 'communities_source_data', 'ccbc_service_account');

end
$grant$;

COMMIT;
