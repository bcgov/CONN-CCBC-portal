-- Deploy ccbc:mutations/create_or_update_application_form_template_9_data to pg

begin;

create or replace function ccbc_public.create_or_update_application_form_template_9_data(
  _application_id int,
  _json_data jsonb,
  _errors jsonb,
  _source jsonb,
  _previous_template_9_id int default null
  )
  returns ccbc_public.application_form_template_9_data as
  $$
  declare
  result ccbc_public.application_form_template_9_data;
  begin
  -- if previous template 9 id is provided, update the existing record
  -- else create a new record

  -- return the updated or created record

  if _previous_template_9_id is not null then
    update ccbc_public.application_form_template_9_data
    set
      application_id = _application_id,
      json_data = _json_data,
      errors = _errors,
      source = _source
    where id = _previous_template_9_id
    returning * into result;
  else
    insert into ccbc_public.application_form_template_9_data(application_id, json_data, errors, source)
    values (_application_id, _json_data, _errors, _source)
    returning * into result;
  end if;

  return result;
  end;
  $$ language plpgsql volatile;

commit;
