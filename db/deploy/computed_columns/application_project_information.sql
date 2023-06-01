-- Deploy ccbc:computed_columns/application_project_information to pg

begin;

create or replace function ccbc_public.application_project_information(application ccbc_public.application)
returns ccbc_public.project_information_data as
$$
select row(pi.*) from ccbc_public.project_information_data as pi
    where pi.application_id = application.id
    and archived_at is null
    order by pi.id desc limit 1;
$$ language sql stable;

grant execute on function ccbc_public.application_project_information to ccbc_analyst;
grant execute on function ccbc_public.application_project_information to ccbc_admin;

comment on function ccbc_public.application_project_information is 'Computed column to return project information data';

commit;
