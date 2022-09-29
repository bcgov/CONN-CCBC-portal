-- Deploy ccbc:computed_columns/application_form_data_id to pg

begin;

create or replace function ccbc_public.application_form_data_id(application ccbc_public.application) returns int as
$$
  select ccbc_public.form_data.id from
  ccbc_public.form_data, ccbc_public.application_form_data
  where ccbc_public.application_form_data.application_id = application.id
  order by form_data_id desc limit 1;
$$ language sql stable;

grant execute on function ccbc_public.application_form_data to ccbc_auth_user;

comment on function ccbc_public.application_form_data_id is 'Computed column to display form_data id';

commit;
