-- Deploy ccbc:tables/intake_001_add_permissions to pg

begin;

do
$$
begin

  perform ccbc_private.grant_permissions('select', 'intake', 'ccbc_admin');
  perform ccbc_private.grant_permissions('select', 'intake', 'ccbc_analyst');

end
$$;

commit;
