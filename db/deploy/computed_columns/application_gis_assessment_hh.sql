-- Deploy ccbc:computed_columns/application_gis_assessment_hh to pg
begin;

create or replace function ccbc_public.application_gis_assessment_hh(application ccbc_public.application)
returns ccbc_public.application_gis_assessment_hh as
$$
select row(aga.*) from ccbc_public.application_gis_assessment_hh as aga
  where aga.application_id = application.id
  order by aga.id desc limit 1;
$$ language sql stable;

comment on function ccbc_public.application_gis_assessment_hh is 'Computed column to return the GIS assessment household counts';

grant execute on function ccbc_public.application_gis_assessment_hh to ccbc_analyst;
grant execute on function ccbc_public.application_gis_assessment_hh to ccbc_admin;

commit;
