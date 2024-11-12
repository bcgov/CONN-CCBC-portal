-- deploy ccbc:mutations/create_assessment_form to pg

begin;

drop function ccbc_public.create_assessment_form(varchar , jsonb , integer);

create or replace function ccbc_public.create_assessment_form(_assessment_type varchar, _json_data jsonb, _application_id int) returns ccbc_public.assessment_data as $$
declare
new_assessment_data_id int;
old_assessment_data_id int;
crtc_project_dependent jsonb;
connected_coast_network_dependent jsonb;
existing_json_data jsonb;
begin

  select ad.id into old_assessment_data_id from ccbc_public.assessment_data as ad where ad.assessment_data_type = _assessment_type and ad.application_id = _application_id
  order by ad.id desc limit 1;



  if (select name from ccbc_public.assessment_type where name = _assessment_type) is null then
    raise exception 'There is no assessment with slug %', schema_slug;
  end if;

  -- If the assessment type is 'technical', remove specific fields and handle dependencies
  if _assessment_type = 'technical' then
    -- Extract the values of the fields and remove them from _json_data
    crtc_project_dependent := jsonb_build_object('crtcProjectDependent', _json_data -> 'crtcProjectDependent');
    connected_coast_network_dependent := jsonb_build_object('connectedCoastNetworkDependent', _json_data -> 'connectedCoastNetworkDependent');
    _json_data := _json_data - 'crtcProjectDependent' - 'connectedCoastNetworkDependent';

    -- Check if the dependency data already exists
    select json_data
    into existing_json_data
    from ccbc_public.application_dependencies
    where application_id = _application_id;

    if existing_json_data is not null then
      -- Update the existing json_data with new fields
      update ccbc_public.application_dependencies
      set json_data = existing_json_data || crtc_project_dependent || connected_coast_network_dependent,
          updated_at = now()
      where application_id = _application_id;
    else
      -- Insert new json_data with the extracted fields
      insert into ccbc_public.application_dependencies (
        application_id, json_data, created_at
      ) values (
        _application_id, crtc_project_dependent || connected_coast_network_dependent, now()
      );
    end if;
  end if;

  insert into ccbc_public.assessment_data (json_data, assessment_data_type, application_id)
    values ( _json_data, _assessment_type, _application_id) returning id into new_assessment_data_id;

  if exists (select * from ccbc_public.assessment_data where id = old_assessment_data_id)
    then update ccbc_public.assessment_data set archived_at = now() where id = old_assessment_data_id;
  end if;

  return (select row(ccbc_public.assessment_data.*) from ccbc_public.assessment_data where id = new_assessment_data_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_assessment_form to ccbc_analyst;

grant execute on function ccbc_public.create_assessment_form to ccbc_admin;

commit;
