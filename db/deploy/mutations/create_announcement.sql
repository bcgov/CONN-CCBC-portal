-- Deploy ccbc:mutations/create_announcement_record to pg

begin;

drop function if exists ccbc_public.create_announcement_record(project_numbers varchar, json_data jsonb, old_row_id int);
drop function if exists ccbc_public.create_announcement_record(project_numbers varchar, json_data jsonb);

create or replace function ccbc_public.create_announcement(project_numbers varchar, json_data jsonb)
returns ccbc_public.announcement
as $$

begin
  return ccbc_public.update_announcement(project_numbers:=project_numbers,json_data:=json_data,old_row_id:=-1);
end;
$$ language plpgsql strict volatile;

grant execute on function ccbc_public.create_announcement(project_numbers varchar, json_data jsonb) to ccbc_analyst;
grant execute on function ccbc_public.create_announcement(project_numbers varchar, json_data jsonb) to ccbc_admin;

commit;
