-- Deploy ccbc:computed_columns/application_project_name to pg

begin;

create or replace function ccbc_public.application_project_name(application ccbc_public.application) returns text as $$
  select application.form_data -> 'projectInformation' ->> 'projectTitle'
$$ language sql stable;

grant execute on function ccbc_public.application_project_name to ccbc_auth_user;

commit;
