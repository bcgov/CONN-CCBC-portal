-- deploy ccbc:computed_columns/application_assessment_form to pg

begin;

drop function ccbc_public.application_assessment_form(ccbc_public.application, varchar);

create or replace function ccbc_public.application_assessment_form(application ccbc_public.application, _assessment_data_type varchar) returns ccbc_public.assessment_data as $$

select row(ad.*) from ccbc_public.assessment_data as ad
  where ad.application_id = application.id
  and ad.assessment_data_type = _assessment_data_type
  and ad.archived_at is null
  order by ad.id desc limit 1;

$$ language sql stable;

grant execute on function ccbc_public.application_assessment_form to ccbc_admin;
grant execute on function ccbc_public.application_assessment_form to ccbc_analyst;

comment on function ccbc_public.application_assessment_form is 'Computed column that takes the slug to return an assessment form';

commit;
