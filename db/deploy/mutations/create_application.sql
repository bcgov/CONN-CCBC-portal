-- Deploy ccbc:mutations/create_application to pg

begin;

drop function ccbc_public.create_application;

create or replace function ccbc_public.create_application(code text default '')
returns ccbc_public.application
as $function$
declare
  _open_timestamp timestamp with time zone;
  _open_timestamp_hidden timestamp with time zone;
  _sub varchar;
  result ccbc_public.application;
  new_application_id int;
  new_form_data_id int;
  _form_schema_id int;
  _intake_id int;
begin

  select open_timestamp from ccbc_public.open_intake() into _open_timestamp;
  if code != '' then
    select id, open_timestamp from ccbc_public.intake where hidden_code::text = code into _intake_id, _open_timestamp_hidden;
  end if;
  if _open_timestamp is null and _open_timestamp_hidden is null then
    raise exception 'There is no open intake';
  end if;


  select sub into _sub from ccbc_public.session();

-- Should intakes be linked to the form_schema_id? I'm guessing here that the latest schema is the one we want to use
  select id into _form_schema_id from ccbc_public.form where form_type = 'intake' order by id desc limit 1;

  insert into ccbc_public.application (owner, intake_id) values (_sub, _intake_id)
   returning id into new_application_id;

  -- using nextval instead of returning id on insert to prevent triggering select RLS,
  -- which requires the application_form_data record
  new_form_data_id := nextval(pg_get_serial_sequence('ccbc_public.form_data','id'));

  insert into ccbc_public.form_data (id, json_data, form_schema_id) overriding system value
   values (new_form_data_id , '{}'::jsonb, _form_schema_id);

  insert into ccbc_public.application_form_data (application_id, form_data_id)
   values (new_application_id, new_form_data_id);

  insert into ccbc_public.application_status (application_id, status)
  values (new_application_id, 'draft');

  select * from ccbc_public.application where id = new_application_id into result;
  return result;
end;
$function$ language plpgsql strict volatile;

grant execute on function ccbc_public.create_application to ccbc_auth_user;

commit;
