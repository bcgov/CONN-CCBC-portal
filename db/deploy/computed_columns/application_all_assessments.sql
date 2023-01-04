-- Deploy ccbc:computed_columns/application_all_assessments to pg

begin;

create or replace function ccbc_public.application_all_assessments(application ccbc_public.application) returns setof ccbc_public.form_data as $$

select row(fd.*) from ccbc_public.form_data as fd, ccbc_public.form as f,
  ccbc_public.application_form_data as af where af.application_id = application.id
  and fd.id = af.form_data_id and fd.form_schema_id = f.id
  and f.form_type = 'assessment'
  and fd.archived_at is null;

$$ language sql stable;

grant execute on function ccbc_public.application_all_assessments to ccbc_admin;
grant execute on function ccbc_public.application_all_assessments to ccbc_analyst;

comment on function ccbc_public.application_assessment_form is 'Computed column that returns list of assessment form data';

commit;
