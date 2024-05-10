-- Deploy ccbc:tables/cbc_projects_001_permissions to pg
begin;
do $grant$
  perform ccbc_private.grant_permissions('select', 'cbc_data', 'cbc_admin');

  perform ccbc_private.grant_permissions('select', 'cbc_data', 'ccbc_admin');

  perform ccbc_private.grant_permissions('select', 'cbc_data', 'ccbc_analyst');

  perform ccbc_private.grant_permissions('update', 'cbc_data', 'cbc_admin');

  perform ccbc_private.grant_permissions('insert', 'cbc_data', 'cbc_admin');
end
$grant$;
commit;
