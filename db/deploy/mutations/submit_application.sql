-- Deploy ccbc:mutations/submit_application to pg

begin;

create or replace function ccbc_public.submit_application(application_row_id int)
returns ccbc_public.applications as $$
declare
  current_intake_id int;
  current_intake_number int;
  reference_number bigint;
  seq_name varchar;
  application_status varchar;
begin

  select status from ccbc_public.applications where id = application_row_id into application_status;

  if application_status = 'submitted' then
    return (select row(applications.*)::ccbc_public.applications from ccbc_public.applications where id = application_row_id);
  end if;

  if application_status != 'draft' then
    raise 'The application cannot be submitted as it has the following status: %', application_status;
  end if;

  select id, ccbc_intake_number, application_number_seq_name from ccbc_public.open_intake()
  into current_intake_id, current_intake_number, seq_name ;

  if current_intake_id is null then
    raise 'There is no open intake, the application cannot be submitted';
  end if;

  select nextval(seq_name) into reference_number;

  update ccbc_public.applications set
    status = 'submitted',
    intake_id = current_intake_id,
    ccbc_number = format(
      'CCBC-%s%s', lpad(current_intake_number::text , 2, '0'),
      lpad(reference_number::text, 4, '0')
    )
  where id = application_row_id;

  return (select row(applications.*)::ccbc_public.applications from ccbc_public.applications where id = application_row_id);
end;

$$ language plpgsql;

grant execute on function ccbc_public.submit_application to ccbc_auth_user;


commit;
