-- Deploy ccbc:tables/ccbc_user_001_admin_analyst_permissions to pg

begin;

do
$grant$
begin

  -- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'ccbc_user', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'ccbc_user', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'ccbc_user', 'ccbc_admin',
  ARRAY['given_name', 'family_name', 'email_address', 'created_by', 'created_at', 'updated_by', 'updated_at', 'archived_by', 'archived_at']);

  -- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'ccbc_user', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'ccbc_user', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'ccbc_user', 'ccbc_analyst',
  ARRAY['given_name', 'family_name', 'email_address', 'created_by', 'created_at', 'updated_by', 'updated_at', 'archived_by', 'archived_at']);

end
$grant$;

do
$policy$
begin

-- ccbc_admin RLS: can see all users, but can only modify its own record
perform ccbc_private.upsert_policy('ccbc_admin_select_ccbc_user', 'ccbc_user', 'select', 'ccbc_admin', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_insert_ccbc_user', 'ccbc_user', 'insert', 'ccbc_admin', 'session_sub=(select sub from ccbc_public.session())');
perform ccbc_private.upsert_policy('ccbc_admin_update_ccbc_user', 'ccbc_user', 'update', 'ccbc_admin', 'session_sub=(select sub from ccbc_public.session())');

-- ccbc_analyst RLS: can see all users, but can only modify its own record
perform ccbc_private.upsert_policy('ccbc_analyst_select_ccbc_user', 'ccbc_user', 'select', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_insert_ccbc_user', 'ccbc_user', 'insert', 'ccbc_analyst', 'session_sub=(select sub from ccbc_public.session())');
perform ccbc_private.upsert_policy('ccbc_analyst_update_ccbc_user', 'ccbc_user', 'update', 'ccbc_analyst', 'session_sub=(select sub from ccbc_public.session())');

end
$policy$;

commit;
