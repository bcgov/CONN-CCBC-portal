-- Deploy ccbc:mutations/update_announcement from pg

begin;

drop function if exists ccbc_public.update_announcement(project_numbers varchar, json_data jsonb, old_row_id int);

create or replace function ccbc_public.update_announcement(project_numbers varchar, json_data jsonb, old_row_id int, update_only boolean default false)
returns ccbc_public.announcement
as $function$
declare
  result ccbc_public.announcement;
  new_row_id int;
  user_sub varchar;
  user_id int;
  announcement_type varchar;
  primary_flag bool;
  operation varchar;
  new_json_data alias for json_data;
begin
  user_sub := (select sub from ccbc_public.session());
  user_id := (select id from ccbc_public.ccbc_user where ccbc_user.session_sub = user_sub);
  new_row_id := nextval(pg_get_serial_sequence('ccbc_public.announcement','id'));
  announcement_type := json_data->>'announcementType';
  primary_flag := (select case announcement_type when 'Primary' then true else false end);

  -- set operation for history tracking
  if old_row_id <> -1 then
    operation := 'updated';
  else
    operation := 'created';
  end if;

  -- if update_only is true and old_row_id is valid, only update json_data
  if update_only = true and old_row_id <> -1 then
    update ccbc_public.announcement
    set json_data = new_json_data
    where id = old_row_id
    returning * into result;

    return result;
  end if;

  -- insert into ccbc_public.announcement table
  insert into ccbc_public.announcement (id, ccbc_numbers, json_data)
    overriding system value
    values (new_row_id, project_numbers, new_json_data);

  -- split project_numbers into ccbc_numbers and insert into ccbc_public.application_announcement
  insert into  ccbc_public.application_announcement (announcement_id, application_id, is_primary, history_operation)
  select new_row_id, id, primary_flag, operation from ccbc_public.application where ccbc_number
    in (select ccbc_number from unnest(string_to_array(project_numbers, ',')) ccbc_number group by ccbc_number);

  if old_row_id <> -1 then
    update ccbc_public.announcement set archived_at = now(), archived_by = user_id where id = old_row_id;
    update ccbc_public.application_announcement
    set archived_at = now(),
        archived_by = user_id,
        history_operation = case
          when application_id in (
            select id from ccbc_public.application where ccbc_number
              in (select ccbc_number from unnest(string_to_array(project_numbers, ',')) ccbc_number group by ccbc_number)
          ) then history_operation
          else 'deleted'
        end
    where announcement_id = old_row_id and archived_at is null;
  end if;

  select * from ccbc_public.announcement where id=new_row_id into result;
  return result;
end;
$function$ language plpgsql strict volatile;

grant execute on function ccbc_public.update_announcement(project_numbers varchar, json_data jsonb, old_row_id int, update_only boolean) to ccbc_analyst;
grant execute on function ccbc_public.update_announcement(project_numbers varchar, json_data jsonb, old_row_id int, update_only boolean) to ccbc_admin;

commit;
