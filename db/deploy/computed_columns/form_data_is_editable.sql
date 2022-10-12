-- Deploy ccbc:computed_columns/form_data_is_editable to pg

begin;

create or replace function ccbc_public.form_data_is_editable(form_data ccbc_public.form_data) returns boolean as
$$
-- Need to change with the id being linked with the form's intake
  select ((intake.id is not null and form_data.form_data_status_type_id = 'committed') or form_data.form_data_status_type_id = 'pending')
  from ccbc_public.intake as intake, ccbc_public.application_form_data as afd, ccbc_public.application as application, ccbc_public.open_intake() as open_intake
  where ((intake.id = application.intake_id and open_intake.id is not null and open_intake.id = intake.id) or application.intake_id is null or open_intake.id is null)
  and afd.form_data_id = form_data.id and afd.application_id = application.id limit 1;
$$ language sql stable;

grant execute on function ccbc_public.form_data_is_editable to ccbc_auth_user;

comment on function ccbc_public.form_data_is_editable is 'computed column to display whether form_data is editable or not';

commit;
