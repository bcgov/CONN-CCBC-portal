-- Revert ccbc:tables/cbc_data_001_permissions from pg

begin;


  -- perform ccbc_private.grant_permissions('select', 'cbc_data', 'cbc_admin');
  -- perform ccbc_private.grant_permissions('select', 'cbc_data', 'ccbc_admin');
  -- perform ccbc_private.grant_permissions('select', 'cbc_data', 'ccbc_analyst');


  -- perform ccbc_private.grant_permissions('update', 'cbc_data', 'cbc_admin');
  -- perform ccbc_private.grant_permissions('insert', 'cbc_data', 'cbc_admin');

  revoke select on ccbc_public.cbc_data from ccbc_admin;
  revoke select on ccbc_public.cbc_data from ccbc_analyst;
  revoke select on ccbc_public.cbc_data from cbc_admin;


  revoke update on ccbc_public.cbc_data from cbc_admin;
  revoke insert on ccbc_public.cbc_data from cbc_admin;


commit;
