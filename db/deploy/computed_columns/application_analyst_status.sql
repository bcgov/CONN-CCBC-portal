-- Deploy ccbc:computed_columns/application_analyst_status to pg

begin;

create or replace function ccbc_public.application_analyst_status(application ccbc_public.application) returns varchar as
$$
select appstat.status from ccbc_public.application_status as appstat,
    ccbc_public.application_status_type as astype
    where appstat.application_id = application.id
    and astype.name = appstat.status
    and astype.visible_by_analyst = true
    order by appstat.id desc limit 1;
$$ language sql stable;

grant execute on function ccbc_public.application_analyst_status to ccbc_job_executor;
grant execute on function ccbc_public.application_analyst_status to ccbc_analyst;
grant execute on function ccbc_public.application_analyst_status to ccbc_admin;

-- ccbc_readonly user is used by Metabase and it is added outside of this project.
-- statement below should be run manually to allow Metabase users to use the function.
-- grant execute on function ccbc_public.application_analyst_status to ccbc_readonly;

comment on function ccbc_public.application_analyst_status is 'Computed column to return the analyst-visible status of an application';

commit;
