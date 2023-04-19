-- Deploy ccbc:tables/ccbc_user_003_grant_archiver_select_permission to pg

begin;


do
$$
begin

perform ccbc_private.grant_permissions('select', 'ccbc_user', 'ccbc_archiver');
perform ccbc_private.upsert_policy('ccbc_archiver_select_ccbc_user', 'ccbc_user', 'select', 'ccbc_archiver', '(true)');

end
$$;

commit;
