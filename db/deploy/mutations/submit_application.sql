-- Deploy ccbc:mutations/submit_application to pg

begin;

create or replace function ccbc_public.submit_application(application_row_id int)
returns ccbc_public.application as $$
declare
  current_intake_id int;
  current_intake_number int;
  reference_number bigint;
  seq_name varchar;
  application_status varchar;
  submission_completed_for varchar;
  submission_completed_by varchar;
  submission_title varchar;
  submission_date varchar;
  num_acknowledgements constant integer := 17;
  _form_data jsonb;
begin

  select ccbc_public.application_status(
    (select row(ccbc_public.application.*)::ccbc_public.application from ccbc_public.application where id = application_row_id)
    ) into application_status;

  if application_status = 'submitted' then
    return (select row(application.*)::ccbc_public.application from ccbc_public.application where id = application_row_id);
  end if;

  if application_status != 'draft' then
    raise 'The application cannot be submitted as it has the following status: %', application_status;
  end if;

  select form_data from
   ccbc_public.application_form_data((select row(ccbc_public.application.*)::ccbc_public.application from ccbc_public.application where id = application_row_id))
    into _form_data;

  -- select ccbc_public.application_form_data(ccbc_public.application.*) -> 'submission' ->> 'submissionCompletedFor',
  --   form_data -> 'submission' ->> 'submissionCompletedBy',
  --   form_data -> 'submission' ->> 'submissionTitle',
  --   form_data -> 'submission' ->> 'submissionDate',
  --   jsonb_array_length(form_data -> 'acknowledgements' -> 'acknowledgementsList')
  --  from ccbc_public.application where id = application_row_id
  --  into submission_completed_for, submission_completed_by, submission_title, submission_date, acknowledgements_array_length;

  if coalesce(_form_data -> 'submission' ->> 'submissionCompletedFor', '') = '' then
    raise 'The application cannot be submitted as the submission field submission_completed_for is null or empty';
  end if;

  if coalesce(_form_data -> 'submission' ->> 'submissionCompletedBy', '') = '' then
    raise 'The application cannot be submitted as the submission field submission_completed_by is null or empty';
  end if;

  if coalesce(_form_data -> 'submission' ->> 'submissionTitle', '') = '' then
    raise 'The application cannot be submitted as the submission field submission_title is null or empty';
  end if;

  if coalesce(_form_data -> 'submission' ->> 'submissionDate', '') = '' then
    raise 'The application cannot be submitted as the submission field submission_date is null or empty';
  end if;

  if coalesce(jsonb_array_length(_form_data -> 'acknowledgements' -> 'acknowledgementsList'),0) <> num_acknowledgements then
    raise 'The application cannot be submitted as there are unchecked acknowledgements';
  end if;

  select id, ccbc_intake_number, application_number_seq_name from ccbc_public.open_intake()
  into current_intake_id, current_intake_number, seq_name;

  if current_intake_id is null then
    raise 'There is no open intake, the application cannot be submitted';
  end if;

  select nextval(seq_name) into reference_number;

  insert into ccbc_public.application_status
    (application_id, status) values (application_row_id, 'submitted');

  update ccbc_public.application set
    intake_id = current_intake_id,
    ccbc_number = format(
      'CCBC-%s%s', lpad(current_intake_number::text , 2, '0'),
      lpad(reference_number::text, 4, '0')
    )
  where id = application_row_id;

  return (select row(application.*)::ccbc_public.application from ccbc_public.application where id = application_row_id);
end;

$$ language plpgsql;

grant execute on function ccbc_public.submit_application to ccbc_auth_user;


commit;
