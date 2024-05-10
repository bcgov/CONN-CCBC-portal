-- Deploy ccbc:tables/cbc_projects_001_permissions to pg
begin;
do $grant$

  perform ccbc_private.grant_permissions('select', 'cbc_projects', 'cbc_admin');
  perform ccbc_private.grant_permissions('select', 'cbc_projects', 'ccbc_admin');
  perform ccbc_private.grant_permissions('select', 'cbc_projects', 'ccbc_analyst');


  perform ccbc_private.grant_permissions('update', 'cbc_projects', 'cbc_admin');
  perform ccbc_private.grant_permissions('insert', 'cbc_projects', 'cbc_admin');
end
$grant$;
commit;
