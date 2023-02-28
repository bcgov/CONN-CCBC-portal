-- Deploy ccbc:tables/analyst_003_permissions to pg

begin;

do
$grant$
begin

-- Grant permissions
perform ccbc_private.grant_permissions('insert', 'analyst', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'analyst', 'ccbc_admin');

perform ccbc_private.grant_permissions('update', 'analyst', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'analyst', 'ccbc_admin');

end
$grant$;

commit;
