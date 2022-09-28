-- Deploy ccbc:computed_columns/application_form_data to pg

begin;

create or replace function ccbc_public.application_form_data(application ccbc_public.application) returns jsonb as
$$
  select form_data from ccbc_public.form_data where id in
   (select form_data_id from ccbc_public.application_form_data where
    application_id = application.id order by form_data_id desc limit 1 );
$$ language sql stable;

grant execute on function ccbc_public.application_form_data to ccbc_auth_user;

comment on function ccbc_public.application_form_data is 'Computed column to display form_data';

commit;
