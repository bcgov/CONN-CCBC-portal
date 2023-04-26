-- Deploy ccbc:mutations/save_gis_assessment_hh to pg

begin;

create or replace function ccbc_public.save_gis_assessment_hh(_application_id int, _eligible float(2) default null, _eligible_indigenous float(2) default null) returns ccbc_public.application_gis_assessment_hh as $$
declare
application_gis_assessment_hh_id int;
begin

  select aga.id into application_gis_assessment_hh_id from ccbc_public.application_gis_assessment_hh as aga where aga.application_id = _application_id
  order by aga.id desc limit 1;

  if application_gis_assessment_hh_id is not null
    then update ccbc_public.application_gis_assessment_hh set eligible = _eligible, eligible_indigenous = _eligible_indigenous
    where id = application_gis_assessment_hh_id;
  else
    insert into ccbc_public.application_gis_assessment_hh (application_id, eligible, eligible_indigenous)
    values (_application_id, _eligible, _eligible_indigenous);
  end if;

  return (select row(ccbc_public.application_gis_assessment_hh.*) from ccbc_public.application_gis_assessment_hh where id = application_gis_assessment_hh_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.save_gis_assessment_hh to ccbc_analyst;
grant execute on function ccbc_public.save_gis_assessment_hh to ccbc_admin;

commit;
