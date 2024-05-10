-- Revert ccbc:tables/cbc_projects_001_permissions from pg

begin;


  -- perform ccbc_private.grant_permissions('select', 'cbc_projects', 'cbc_admin');
  -- perform ccbc_private.grant_permissions('select', 'cbc_projects', 'ccbc_admin');
  -- perform ccbc_private.grant_permissions('select', 'cbc_projects', 'ccbc_analyst');


  -- perform ccbc_private.grant_permissions('update', 'cbc_projects', 'cbc_admin');
  -- perform ccbc_private.grant_permissions('insert', 'cbc_projects', 'cbc_admin');

  revoke select on ccbc_public.cbc_projects from ccbc_admin;
  revoke select on ccbc_public.cbc_projects from ccbc_analyst;
  revoke select on ccbc_public.cbc_projects from cbc_admin;


  revoke update on ccbc_public.cbc_projects from cbc_admin;
  revoke insert on ccbc_public.cbc_projects from cbc_admin;


commit;
