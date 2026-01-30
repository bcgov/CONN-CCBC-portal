-- Deploy ccbc:mutations/create_intake to pg

begin;

drop function if exists ccbc_public.create_intake;

create or replace function ccbc_public.create_intake(start_time timestamp with time zone, end_time timestamp with time zone, intake_description text default '', rolling_intake boolean default false, hidden_code uuid default null, allow_unlisted_fn_led_zones boolean default true, zones int[] default ARRAY[]::int[]) returns ccbc_public.intake as $$
declare
  result ccbc_public.intake;
  new_counter_id int;
  new_intake_number int;
  previous_intake_end_date timestamp with time zone;
begin
  select close_timestamp into previous_intake_end_date
  from ccbc_public.intake
  where archived_at is null and hidden = 'false'
  order by ccbc_intake_number
  desc limit 1;

  if start_time >= end_time then
    raise exception 'The start date for the new intake must be before the end date';
  end if;

  if previous_intake_end_date is not null and previous_intake_end_date >= start_time then
    raise exception 'The start time for the new intake must be after the end time of the previous intake';
  end if;

  select coalesce((max(ccbc_intake_number) + 1), 1) into new_intake_number from ccbc_public.intake where archived_at is null and hidden = 'false';

  select id from ccbc_public.gapless_counter order by id desc limit 1 into new_counter_id;
    -- if no record is found, insert a new record with a counter value of 47
  if new_counter_id is null then
    insert into ccbc_public.gapless_counter (counter) values (47)
    returning id into new_counter_id;
  end if;
  insert into ccbc_public.intake (open_timestamp, close_timestamp, ccbc_intake_number, counter_id, description, rolling_intake, hidden_code, allow_unlisted_fn_led_zones, zones)
    values (start_time, end_time, new_intake_number, new_counter_id, intake_description, rolling_intake, hidden_code, allow_unlisted_fn_led_zones, zones) returning * into result;

  return result;
end;
$$ language plpgsql volatile;

comment on function ccbc_public.create_intake is 'Function to create intakes for the ccbc admin';

grant execute on function ccbc_public.create_intake to ccbc_admin;

commit;
