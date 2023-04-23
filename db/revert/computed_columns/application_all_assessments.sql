-- Deploy ccbc:computed_columns/application_all_assessments to pg

begin;

drop function if exists ccbc_public.application_all_assessments(ccbc_public.application);
create or replace function ccbc_public.application_all_assessments(application ccbc_public.application) returns setof ccbc_public.form_data as $$

  select row(fd.*) from ccbc_public.form_data as fd
  join ccbc_public.application_form_data af on af.form_data_id = fd.id
  join ccbc_public.form f on f.id = fd.form_schema_id
  where af.application_id = application.id
  and f.form_type = 'assessment'
  and fd.archived_at is null
  order by fd.id;

$$ language sql stable;

grant execute on function ccbc_public.application_all_assessments to ccbc_admin;
grant execute on function ccbc_public.application_all_assessments to ccbc_analyst;

comment on function ccbc_public.application_assessment_form is 'Computed column that returns list of assessment form data';

commit;
