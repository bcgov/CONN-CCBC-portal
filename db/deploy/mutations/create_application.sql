-- Deploy ccbc:mutations/create_application to pg


-- Deploy ccbc:mutations/create_application to pg

begin;

create or replace function ccbc_public.create_application()
returns ccbc_public.application
as $function$
declare
  _open_timestamp timestamp with time zone;
  _sub uuid;
  result ccbc_public.application;
  new_application_id int;
begin

  select open_timestamp from ccbc_public.open_intake() into _open_timestamp;
  if _open_timestamp is null then
    raise exception 'There is no open intake';
  end if;

  select sub into _sub from ccbc_public.session();

  insert into ccbc_public.application (form_data, owner) values ('{}'::jsonb, _sub)
   returning id into new_application_id;

  insert into ccbc_public.application_status (application_id, status) 
  values (new_application_id, 'draft');

  select * from ccbc_public.application where id = new_application_id into result;
  return result;
end;
$function$ language plpgsql strict volatile;

grant execute on function ccbc_public.create_application to ccbc_auth_user;

commit;
