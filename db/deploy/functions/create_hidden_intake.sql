-- deploy ccbc:functions/create_hidden_intake to pg

begin;

create or replace function ccbc_public.create_hidden_intake(start_time timestamp with time zone, end_time timestamp with time zone, _ccbc_intake_number int default 99, intake_description text default '') returns ccbc_public.intake as $$
declare
  result ccbc_public.intake;
  new_counter_id int;
  previous_hidden_intake int;
begin
  select id into previous_hidden_intake
  from ccbc_public.intake
  where archived_at is null and hidden = 'true'
  order by ccbc_intake_number
  desc limit 1;

  if start_time >= end_time then
    raise exception 'The start date for the new intake must be before the end date';
  end if;

  if previous_hidden_intake is not null then
    raise exception 'Cannot have more than one hidden intake, please update intake end time';
  end if;


  insert into ccbc_public.gapless_counter (counter) values (0) returning id into new_counter_id;
  insert into ccbc_public.intake (open_timestamp, close_timestamp, ccbc_intake_number, counter_id, description, hidden, hidden_code)
    values (start_time, end_time, _ccbc_intake_number, new_counter_id, intake_description, 'true', uuid_generate_v4()) returning * into result;

  return result;
end;
$$ language plpgsql strict volatile;

comment on function ccbc_public.create_hidden_intake is 'Function to create intakes for the ccbc admin';

grant execute on function ccbc_public.create_hidden_intake to ccbc_admin;

commit;
