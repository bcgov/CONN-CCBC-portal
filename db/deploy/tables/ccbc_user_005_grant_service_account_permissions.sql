-- Deploy ccbc:tables/ccbc_user_005_grant_service_account_permissions to pg

BEGIN;

do
$$
begin

-- Grant ccbc_auth_user permissions
perform ccbc_private.grant_permissions('select', 'ccbc_user', 'ccbc_service_account');
perform ccbc_private.grant_permissions('insert', 'ccbc_user', 'ccbc_service_account');
perform ccbc_private.grant_permissions('update', 'ccbc_user', 'ccbc_service_account',
  ARRAY['given_name', 'family_name', 'email_address', 'created_by', 'created_at', 'updated_by', 'updated_at', 'archived_by', 'archived_at']);

end
$$;

COMMIT;
