-- Deploy ccbc:computed_columns/form_data_is_editable to pg

begin;

create or replace function ccbc_public.form_data_is_editable(form_data ccbc_public.form_data) returns boolean as
$$
  with open_intake as (
    select * from ccbc_public.open_intake()
  )
   select coalesce(
    (
      select true from open_intake
      where open_intake.id is not null and form_data.form_data_status_type_id = 'pending'
    ),
    (
      select true
      from ccbc_public.application app
      where app.id in (select application_id from ccbc_public.application_form_data where form_data_id = form_data.id)
      and ccbc_public.application_status(app) = 'submitted'
      and app.intake_id = (select id from open_intake)
    ),
    false
   )
$$ language sql stable;

grant execute on function ccbc_public.form_data_is_editable to ccbc_auth_user;

comment on function ccbc_public.form_data_is_editable is 'computed column to display whether form_data is editable or not';

commit;
