-- deploy ccbc:computed_columns/application_assessment_form to pg

begin;

create or replace function ccbc_public.application_assessment_form(application ccbc_public.application, _slug varchar) returns ccbc_public.form_data as $$

select row(fd.*) from ccbc_public.form_data as fd, ccbc_public.form as f,
  ccbc_public.application_form_data as af where af.application_id = application.id
  and fd.id = af.form_data_id and fd.form_schema_id = f.id and f.slug = _slug
  and f.type = 'assessment'
  order by fd.id desc limit 1;

$$ language sql stable;

grant execute on function ccbc_public.application_assessment_form to ccbc_admin;
grant execute on function ccbc_public.application_assessment_form to ccbc_analyst;

comment on function ccbc_public.application_assessment_form is 'Computed column that takes the slug to return an assessment form';

commit;
