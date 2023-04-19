-- Deploy ccbc:mutations/create_announcement_record to pg
-- named create_announcement_record to avoid GraphQL error
-- A type naming conflict has occurred - two entities have tried to define the same type 'CreateAnnouncementPayload'
begin;

create or replace function ccbc_public.create_announcement_record(project_numbers varchar, json_data jsonb, old_row_id int)
returns ccbc_public.announcement
as $function$
declare
  result ccbc_public.announcement;
  new_row_id int;  
  user_sub varchar;
  user_id int; 

begin
  user_sub := (select sub from ccbc_public.session());
  user_id := (select id from ccbc_public.ccbc_user where ccbc_user.session_sub = user_sub);
  new_row_id := nextval(pg_get_serial_sequence('ccbc_public.announcement','id'));

  -- insert into ccbc_public.announcement table
  insert into ccbc_public.announcement (id, ccbc_numbers, json_data)
    overriding system value
    values (new_row_id, project_numbers, json_data);

  -- split project_numbers into ccbc_numbers and insert into ccbc_public.application_announcement
  insert into  ccbc_public.application_announcement (announcement_id, application_id)
  select new_row_id, id from ccbc_public.application where ccbc_number 
    in (select ccbc_number from unnest(string_to_array(project_numbers, ',')) ccbc_number);

  if old_row_id <> -1 then
    update ccbc_public.announcement set archived_at = now(), archived_by = user_id where id = old_row_id;
  end if;

  select * from ccbc_public.announcement where id=new_row_id into result;
  return result;
end;
$function$ language plpgsql strict volatile;

create or replace function ccbc_public.create_announcement_record(project_numbers varchar, json_data jsonb)
returns ccbc_public.announcement
as $$

begin
  return ccbc_public.create_announcement_record(project_numbers:=project_numbers,json_data:=json_data,old_row_id:=-1);
end;
$$ language plpgsql strict volatile;

grant execute on function ccbc_public.create_announcement_record(project_numbers varchar, json_data jsonb, old_row_id int) to ccbc_analyst;
grant execute on function ccbc_public.create_announcement_record(project_numbers varchar, json_data jsonb, old_row_id int) to ccbc_admin;
grant execute on function ccbc_public.create_announcement_record(project_numbers varchar, json_data jsonb) to ccbc_analyst;
grant execute on function ccbc_public.create_announcement_record(project_numbers varchar, json_data jsonb) to ccbc_admin;

commit;
