-- Deploy ccbc:tables/ccbc_user_003_grant_archiver_select_permission to pg

begin;


do
$$
begin

perform ccbc_private.grant_permissions('select', 'ccbc_user', 'ccbc_archiver');
-- perform ccbc_private.grant_permissions('select', 'application_status', 'ccbc_admin');

end
$$;

commit;
