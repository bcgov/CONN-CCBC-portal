-- Deploy ccbc:mutations/update_intake to pg

begin;

drop function if exists ccbc_public.update_intake;
create or replace function ccbc_public.update_intake(intake_number int, start_time timestamp with time zone, end_time timestamp with time zone, intake_description text default '', is_rolling_intake boolean default false, hidden_intake_code uuid default null, is_allow_unlisted_fn_led_zones boolean default true, intake_zones int[] default ARRAY[]::int[])
returns ccbc_public.intake as $$
declare
  next_intake int;
  next_intake_start_date timestamp with time zone;
  previous_intake_end_date timestamp with time zone;
  previous_intake int;
begin

  next_intake = intake_number + 1;

  if intake_number = 1 then
    previous_intake = 1;
  else
    previous_intake = intake_number - 1;
  end if;

  select open_timestamp into next_intake_start_date from ccbc_public.intake
  where ccbc_intake_number = next_intake and archived_at is null;

  select close_timestamp into previous_intake_end_date from ccbc_public.intake
  where ccbc_intake_number = previous_intake and archived_at is null;

  if start_time >= end_time then
    raise exception 'The start date for the intake must be before the end date';
  end if;

  if next_intake_start_date is not null and next_intake_start_date <= end_time then
    raise exception 'The end time for the intake must be before the start time of the next intake';
  end if;

  if previous_intake_end_date is not null and previous_intake_end_date >= start_time then
    raise exception 'The start time for the intake must be after the end time of the previous intake';
  end if;

  update ccbc_public.intake
  set open_timestamp = start_time,
      close_timestamp = end_time,
      description = intake_description,
      rolling_intake = is_rolling_intake,
      hidden_code = hidden_intake_code,
      allow_unlisted_fn_led_zones = is_allow_unlisted_fn_led_zones,
      zones = intake_zones
  where ccbc_intake_number = intake_number and archived_at is null;

  return (select row(ccbc_public.intake.*) from ccbc_public.intake where ccbc_intake_number = intake_number and archived_at is null
  order by id desc limit 1);

end;
$$ language plpgsql volatile;

comment on function ccbc_public.update_intake is 'Function to update intakes for the ccbc admin';

grant execute on function ccbc_public.update_intake to ccbc_admin;

commit;
