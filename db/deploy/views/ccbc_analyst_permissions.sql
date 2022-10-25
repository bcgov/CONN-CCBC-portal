-- Deploy ccbc:views/ccbc_analyst_permissions to pg

begin;

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'application', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'application_status', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'application_form_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'form_data', 'ccbc_analyst');

grant execute on function ccbc_public.application_status to ccbc_analyst;

end
$grant$;

commit;
