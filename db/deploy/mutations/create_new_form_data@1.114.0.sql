-- Deploy ccbc:mutations/create_new_form_data to pg

begin;

create or replace function ccbc_public.create_new_form_data(application_row_id int, json_data jsonb, reason_for_change varchar, form_schema_id int)
returns ccbc_public.form_data
as $function$
declare
  result ccbc_public.form_data;
  new_form_data_id int;
  old_form_data_id int;
begin
  new_form_data_id := nextval(pg_get_serial_sequence('ccbc_public.form_data','id'));

  select form_data_id from ccbc_public.application_form_data where
    application_id = application_row_id into old_form_data_id order by form_data_id desc limit 1;

  insert into ccbc_public.form_data (id, json_data, form_schema_id, reason_for_change) overriding system value
    values (new_form_data_id, json_data, form_schema_id, reason_for_change);

  insert into ccbc_public.application_form_data (application_id, form_data_id)
    values (application_row_id, new_form_data_id);

  update ccbc_public.form_data set archived_at = now() where id = old_form_data_id;

  select * from ccbc_public.form_data where id = new_form_data_id into result;
  return result;
end;
$function$ language plpgsql strict volatile;

grant execute on function ccbc_public.create_new_form_data to ccbc_analyst;
grant execute on function ccbc_public.create_new_form_data to ccbc_admin;

commit;
