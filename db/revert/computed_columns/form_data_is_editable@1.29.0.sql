-- Deploy ccbc:computed_columns/form_data_is_editable to pg

begin;

create or replace function ccbc_public.form_data_is_editable(form_data ccbc_public.form_data) returns boolean as
$$
declare
open_intake_id int;
attached_application ccbc_public.application;
attached_application_status varchar(1000);
form_data_status varchar(1000):= form_data.form_data_status_type_id;
begin

  select id from ccbc_public.open_intake() into open_intake_id;

  if form_data_status = 'pending' and open_intake_id is not null then
    return true;
  end if;

  select app.* into attached_application from ccbc_public.application_form_data as afd, ccbc_public.application as app where afd.form_data_id = form_data.id
  and afd.application_id = app.id ;

  select ccbc_public.application_status(attached_application) into attached_application_status;

  if form_data_status = 'committed' and open_intake_id = attached_application.intake_id and attached_application_status = 'submitted' then
    return true;
  end if;

  return false;
end
$$ language plpgsql stable;

grant execute on function ccbc_public.form_data_is_editable to ccbc_auth_user;

comment on function ccbc_public.form_data_is_editable is 'computed column to display whether form_data is editable or not';

commit;
