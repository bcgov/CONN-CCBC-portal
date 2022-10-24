-- Deploy ccbc:tables/application_status_001_give_read_and_insert_to_ccbc_analyst to pg

begin;

do
$$
begin

perform ccbc_private.grant_permissions('select', 'application_status', 'ccbc_analyst');
-- added insert to the policy for the future when an analyst is changing the application status
perform ccbc_private.grant_permissions('insert', 'application_status', 'ccbc_analyst');

-- RLS

perform ccbc_private.upsert_policy('ccbc_analyst_user_select_application_status',
'application_status', 'select', 'ccbc_analyst', '(true)');

perform ccbc_private.upsert_policy('ccbc_analyst_user_insert_application_status',
'application_status', 'insert','ccbc_analyst','(true)');

end
$$;

commit;
