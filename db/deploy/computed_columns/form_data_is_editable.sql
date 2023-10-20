-- Deploy ccbc:computed_columns/form_data_is_editable to pg

begin;

create or replace function ccbc_public.form_data_is_editable(form_data ccbc_public.form_data) returns boolean as
$$
  with current_intake as (
    select intake_id
    from ccbc_public.application
    where id = (select application_id from ccbc_public.application_form_data where form_data_id = form_data.id)
  ),
  is_associated_intake_open as (
    select exists (
      select 1 from ccbc_public.intake
      where id = (select intake_id from current_intake)
      and now() >= open_timestamp
      and now() <= close_timestamp
      and archived_at is null
    ) as open_status
  )
  select coalesce(
    (
      select true
      from ccbc_public.application app
      where app.id in (select application_id from ccbc_public.application_form_data where form_data_id = form_data.id)
      and ccbc_public.application_status(app) = 'draft'
      -- We only want the open status of the associated intake to matter for hidden intakes, all other drafts should operate as normal
      and ((select open_status from is_associated_intake_open) or ((select id from ccbc_public.open_intake()) is not null and (select open_status from is_associated_intake_open) = 'false'))
      and form_data.form_data_status_type_id = 'pending'
    ),
    (
      select true
      from ccbc_public.application app
      where app.id in (select application_id from ccbc_public.application_form_data where form_data_id = form_data.id)
      and ccbc_public.application_status(app) = 'submitted'
      and (select open_status from is_associated_intake_open)
    ),
    false
   )
$$ language sql stable;

grant execute on function ccbc_public.form_data_is_editable to ccbc_auth_user, ccbc_admin, ccbc_analyst;

comment on function ccbc_public.form_data_is_editable is 'computed column to display whether form_data is editable or not';

commit;
