-- Deploy ccbc:views/ccbc_analyst_permissions to pg

begin;

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'application', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'application_status', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'application_form_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'form_data', 'ccbc_analyst');

perform ccbc_private.upsert_policy('ccbc_analyst_select_application', 'application', 'select', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_select_application', 'application_status', 'select', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_select_application', 'application_form_data', 'select', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_select_application', 'form_data', 'select', 'ccbc_analyst', 'true');

grant execute on function ccbc_public.application_status to ccbc_analyst;

end
$grant$;

commit;
