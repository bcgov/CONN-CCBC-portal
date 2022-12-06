-- deploy ccbc:tables/attachment_001_add_analyst_roles to pg

begin;

do
$grant$
begin

-- Grant ccbc_auth_user permissions
perform ccbc_private.grant_permissions('select', 'attachment', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'attachment', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'attachment', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'attachment', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'attachment', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'attachment', 'ccbc_admin');

end
$grant$;

-- Enable row-level security
alter table ccbc_public.attachment force row level security;
alter table ccbc_public.attachment enable row level security;

do
$policy$
begin
-- ccbc_auth_user RLS: can see and modify only its own records
perform ccbc_private.upsert_policy('ccbc_analyst_user_select_attachment', 'attachment', 'select', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_user_insert_attachment', 'attachment', 'insert', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_user_update_attachment', 'attachment', 'update', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_user_select_attachment', 'attachment', 'select', 'ccbc_admin', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_user_insert_attachment', 'attachment', 'insert', 'ccbc_admin', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_user_update_attachment', 'attachment', 'update', 'ccbc_admin', 'true');

end
$policy$;

commit;
