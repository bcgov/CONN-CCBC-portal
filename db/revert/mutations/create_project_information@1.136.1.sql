-- Deploy ccbc:mutations/create_project_information to pg

begin;

create or replace function ccbc_public.create_project_information(_application_id int, _json_data jsonb)
returns ccbc_public.project_information_data as $$
declare
new_project_information_id int;
old_project_information_id int;
begin

  select pi.id into old_project_information_id from ccbc_public.project_information_data as pi where pi.application_id = _application_id
  order by pi.id desc limit 1;

  insert into ccbc_public.project_information_data (application_id, json_data)
    values (_application_id, _json_data) returning id into new_project_information_id;

  if exists (select * from ccbc_public.project_information_data where id = old_project_information_id)
    then update ccbc_public.project_information_data set archived_at = now() where id = old_project_information_id;
  end if;

  return (select row(ccbc_public.project_information_data.*) from ccbc_public.project_information_data
    where id = new_project_information_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_project_information to ccbc_analyst;
grant execute on function ccbc_public.create_project_information to ccbc_admin;

commit;
