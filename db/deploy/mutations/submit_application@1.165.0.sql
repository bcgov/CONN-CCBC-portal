-- Deploy ccbc:mutations/submit_application to pg

begin;
drop function if exists ccbc_public.submit_application(application_row_id int);
create or replace function ccbc_public.submit_application(application_row_id int, _form_schema_id int)
returns ccbc_public.application as $$
declare
  current_intake_id int;
  associated_intake_id int;
  current_intake_number int;
  reference_number bigint;
  _counter_id int;
  application_status varchar;
  num_acknowledgements integer;
  _form_data_schema_id integer;
  _form_data jsonb;
  form_data_id int;
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

  select json_data, id, form_schema_id from
   ccbc_public.application_form_data((select row(ccbc_public.application.*)::ccbc_public.application from ccbc_public.application where id = application_row_id))
    into _form_data, form_data_id, _form_data_schema_id;

  select jsonb_array_length(json_schema -> 'properties' -> 'acknowledgements' -> 'properties' -> 'acknowledgementsList' -> 'items' -> 'enum')
    from ccbc_public.form where id = _form_data_schema_id into num_acknowledgements;

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

  select id, ccbc_intake_number, counter_id from ccbc_public.open_intake()
  into current_intake_id, current_intake_number, _counter_id;
  select intake_id from ccbc_public.application where id = application_row_id into associated_intake_id;
  -- Don't have to worry about the application being re-submitted as it will exit earlier with the status check
  if current_intake_id is null or current_intake_id != associated_intake_id then
    select id, ccbc_intake_number, counter_id from ccbc_public.intake where id = associated_intake_id into current_intake_id, current_intake_number, _counter_id;
  end if;

  if current_intake_id is null then
    raise 'There is no open intake, the application cannot be submitted';
  end if;

  insert into ccbc_public.application_status
    (application_id, status) values (application_row_id, 'submitted');

  if current_intake_number = 99 then
    update ccbc_public.application set
      ccbc_number = format(
          'CCBC-025%s',
          lpad((ccbc_public.increment_counter(_counter_id::int))::text, 3, '0')
      ),
      intake_id = current_intake_id where id = application_row_id;
  else
    update ccbc_public.application set
    ccbc_number=format(
        'CCBC-%s%s', lpad(current_intake_number::text , 2, '0'),
        lpad((ccbc_public.increment_counter(_counter_id::int))::text, 4, '0')
      ),
      intake_id = current_intake_id where id = application_row_id;
  end if;

  update ccbc_public.form_data set
    form_data_status_type_id = 'committed',
    form_schema_id = _form_schema_id
    where id = form_data_id;

  return (select row(application.*)::ccbc_public.application from ccbc_public.application where id = application_row_id);
end;

$$ language plpgsql;

grant execute on function ccbc_public.submit_application to ccbc_auth_user;


commit;
