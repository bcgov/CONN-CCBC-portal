-- Deploy ccbc:computed_columns/application_all_assessments to pg

begin;

drop function ccbc_public.application_all_assessments(ccbc_public.application);

create or replace function ccbc_public.application_all_assessments(application ccbc_public.application) returns setof ccbc_public.assessment_data as $$

  select row(ad.*) from ccbc_public.assessment_data as ad
  where ad.application_id = application.id
  and ad.archived_at is null
  order by ad.id;

$$ language sql stable;

grant execute on function ccbc_public.application_all_assessments to ccbc_admin;
grant execute on function ccbc_public.application_all_assessments to ccbc_analyst;

comment on function ccbc_public.application_assessment_form is 'Computed column that returns list of assessment form data';

commit;
