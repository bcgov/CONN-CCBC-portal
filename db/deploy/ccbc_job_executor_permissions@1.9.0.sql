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

-- insert permissions
perform ccbc_private.grant_permissions('insert', 'application_status', 'ccbc_job_executor');

end
$grant$;

commit;
