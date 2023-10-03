-- Deploy ccbc:mutations/create_cbc_project to pg

begin;

create or replace function ccbc_public.create_cbc_project(_json_data jsonb, _sharepoint_timestamp timestamp with time zone default null)
returns ccbc_public.cbc_project as $$
declare
  new_id int;
begin

  insert into ccbc_public.cbc_project (json_data, sharepoint_timestamp)
    values (_json_data, _sharepoint_timestamp) returning id into new_id;

  -- archive the old data
  if exists (select * from ccbc_public.cbc_project where archived_at is null)
    then update ccbc_public.cbc_project
    set archived_at = now() where id != new_id and archived_at is null;
  end if;

  return (select row(ccbc_public.cbc_project.*)
  from ccbc_public.cbc_project
  where id = new_id);

end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_cbc_project to ccbc_analyst;
grant execute on function ccbc_public.create_cbc_project to ccbc_admin;

commit;
