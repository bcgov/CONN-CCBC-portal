-- deploy ccbc:mutations/create_assessment_form to pg

begin;

create or replace function ccbc_public.create_assessment_form(schema_slug varchar, _json_data jsonb, _application_id int) returns ccbc_public.form_data as $$
declare
_form_schema_id  int;
new_form_data_id int;
begin
-- insert row into form_data, with slug as specified from input

  select id into _form_schema_id from ccbc_public.form where slug = schema_slug;

  if _form_schema_id is null then
    raise exception 'There is no schema with slug %', schema_slug;
  end if;

  -- using nextval instead of returning id on insert to prevent triggering insert RLS,
  -- which requires the application_form_data record
  new_form_data_id := nextval(pg_get_serial_sequence('ccbc_public.form_data','id'));

  insert into ccbc_public.form_data (id, json_data, form_data_status_type_id, form_schema_id) overriding system value
    values (new_form_data_id, _json_data, 'committed', _form_schema_id);

  insert into ccbc_public.application_form_data (application_id, form_data_id)
    values (_application_id, new_form_data_id);


  return (select row(ccbc_public.form_data.*) from ccbc_public.form_data where id = new_form_data_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_assessment_form to ccbc_analyst;

grant execute on function ccbc_public.create_assessment_form to ccbc_admin;

commit;
