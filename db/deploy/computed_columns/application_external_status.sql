-- deploy ccbc:computed_columns/application_external_status to pg

begin;

create or replace function ccbc_public.application_external_status(application ccbc_public.application) returns character varying
    language sql stable
as $$
	select status from ccbc_public.application_status
	inner join ccbc_public.application_status_type
	on ccbc_public.application_status_type.name = status
	where application_id= application.id and visible_by_applicant = true
	order by id desc limit 1;
$$;

grant execute on function ccbc_public.application_external_status(ccbc_public.application) to ccbc_admin;
grant execute on function ccbc_public.application_external_status(ccbc_public.application) to ccbc_analyst;
grant execute on function ccbc_public.application_external_status(ccbc_public.application) to ccbc_auth_user;
grant execute on function ccbc_public.application_external_status(ccbc_public.application) to ccbc_job_executor;

comment on function ccbc_public.application_external_status(ccbc_public.application) is 'Computed column to return external status of an application';

commit;
