-- Deploy ccbc:computed_columns/application_project_name to pg

begin;

create or replace function ccbc_public.application_project_name(application ccbc_public.application) returns text as $$
  select coalesce(asd.json_data ->>'projectTitle', afd.json_data -> 'projectInformation' ->> 'projectTitle') from ccbc_public.application_form_data(application) as afd
  left join
  ccbc_public.application_sow_data as asd on asd.application_id = application.id
  order by asd.id desc
  limit 1;
$$ language sql stable;

grant execute on function ccbc_public.application_project_name to ccbc_auth_user;
grant execute on function ccbc_public.application_project_name to ccbc_analyst;
grant execute on function ccbc_public.application_project_name to ccbc_admin;

comment on function ccbc_public.application_project_name is 'Computed column to display the project name';

commit;
