-- Deploy ccbc:ccbc_job_executor_permissions to pg

begin;

do
$grant$
begin

-- select permissions
perform ccbc_private.grant_permissions('select', 'application', 'ccbc_job_executor');
perform ccbc_private.grant_permissions('select', 'application_status', 'ccbc_job_executor');
perform ccbc_private.grant_permissions('select', 'application_status_type', 'ccbc_job_executor');
perform ccbc_private.grant_permissions('select', 'intake', 'ccbc_job_executor');
perform ccbc_private.grant_permissions('select', 'ccbc_user', 'ccbc_job_executor');

-- select rls
perform ccbc_private.upsert_policy('ccbc_job_executor_select_application', 'application', 'select', 'ccbc_job_executor', 'true');
perform ccbc_private.upsert_policy('ccbc_job_executor_select_application_status', 'application_status', 'select', 'ccbc_job_executor', 'true');

-- insert rls
perform ccbc_private.upsert_policy('ccbc_job_executor_insert_application_status', 'application_status', 'insert', 'ccbc_job_executor', 'true');

-- insert permissions
perform ccbc_private.grant_permissions('insert', 'application_status', 'ccbc_job_executor');

end
$grant$;

commit;
