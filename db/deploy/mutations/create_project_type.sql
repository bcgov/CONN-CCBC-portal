-- Deploy ccbc:mutations/create_project_type to pg

begin;

create or replace function ccbc_public.create_project_type(_application_id int, _project_type varchar(20) default null) returns ccbc_public.application_project_type as $$
declare
new_application_project_type_id int;
old_application_project_type_id int;
begin

  select ap.id into old_application_project_type_id from ccbc_public.application_project_type as ap where ap.application_id = _application_id
  order by ap.id desc limit 1;

  insert into ccbc_public.application_project_type (application_id, project_type)
    values (_application_id, _project_type) returning id into new_application_project_type_id;

  if exists (select * from ccbc_public.application_project_type where id = old_application_project_type_id)
    then update ccbc_public.application_project_type set archived_at = now() where id = old_application_project_type_id;
  end if;

  return (select row(ccbc_public.application_project_type.*) from ccbc_public.application_project_type where id = new_application_project_type_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_project_type to ccbc_analyst;
grant execute on function ccbc_public.create_project_type to ccbc_admin;

commit;
