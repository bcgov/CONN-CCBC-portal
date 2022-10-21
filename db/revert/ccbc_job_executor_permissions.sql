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
revoke select on ccbc_public.ccbc_user from ccbc_job_executor;

-- insert permissions
perform ccbc_private.grant_permissions('insert', 'application_status', 'ccbc_job_executor');

-- select rls
drop policy if exists ccbc_job_executor_select_application on ccbc_public.application;
drop policy if exists ccbc_job_executor_select_application_status on ccbc_public.application_status;

-- insert rls
drop policy if exists ccbc_job_executor_insert_application_status on ccbc_public.application_status;

end
$grant$;

commit;
