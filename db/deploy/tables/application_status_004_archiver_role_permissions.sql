-- Deploy ccbc:tables/application_status_004_archiver_role_permissions to pg

begin;

do
$$
begin
perform ccbc_private.grant_permissions('select', 'application_status', 'ccbc_archiver');
perform ccbc_private.grant_permissions('update', 'application_status', 'ccbc_archiver');
end
$$;

select ccbc_private.upsert_policy('ccbc_archiver_update_application_status',
  'application_status', 'update', 'ccbc_archiver', '(true)');

select ccbc_private.upsert_policy('ccbc_archiver_update_application_status',
  'application_status', 'select', 'ccbc_archiver', '(true)');

commit;
