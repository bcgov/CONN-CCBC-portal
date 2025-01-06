-- deploy ccbc:mutations/create_assessment_form to pg

begin;

drop function ccbc_public.create_assessment_form(varchar , jsonb , integer);

create or replace function ccbc_public.create_assessment_form(_assessment_type varchar, _json_data jsonb, _application_id int) returns ccbc_public.assessment_data as $$
declare
new_assessment_data_id int;
old_assessment_data_id int;
begin

  select ad.id into old_assessment_data_id from ccbc_public.assessment_data as ad where ad.assessment_data_type = _assessment_type and ad.application_id = _application_id
  order by ad.id desc limit 1;



  if (select name from ccbc_public.assessment_type where name = _assessment_type) is null then
    raise exception 'There is no assessment with slug %', schema_slug;
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
