-- Deploy ccbc:tables/intake_003_add_insert_permissions to pg

begin;

do
$$
begin

  perform ccbc_private.grant_permissions('insert', 'intake', 'ccbc_admin');
  perform ccbc_private.grant_permissions('update', 'intake', 'ccbc_admin');

end
$$;

commit;
