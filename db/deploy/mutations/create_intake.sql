-- Deploy ccbc:mutations/create_intake to pg

begin;

drop function if exists ccbc_public.create_intake;

create or replace function ccbc_public.create_intake(start_time timestamp with time zone, end_time timestamp with time zone, intake_description text default '') returns ccbc_public.intake as $$
declare
  result ccbc_public.intake;
  new_counter_id int;
  new_intake_number int;
  previous_intake_end_date timestamp with time zone;
begin
  select close_timestamp into previous_intake_end_date
  from ccbc_public.intake
  order by ccbc_intake_number
  desc limit 1;

  if previous_intake_end_date is not null and previous_intake_end_date > start_time then
    raise exception 'The start time for the new intake must be after the end time of the previous intake';
  end if;

  select coalesce((max(ccbc_intake_number) + 1), 1) into new_intake_number from ccbc_public.intake where archived_at is null;

  insert into ccbc_public.gapless_counter (counter) values (0) returning id into new_counter_id;
  insert into ccbc_public.intake (open_timestamp, close_timestamp, ccbc_intake_number, counter_id, description)
    values (start_time, end_time, new_intake_number, new_counter_id, intake_description) returning * into result;

  return result;
end;
$$ language plpgsql strict volatile;

comment on function ccbc_public.create_intake is 'Function to create intakes for the ccbc admin';

grant execute on function ccbc_public.create_intake to ccbc_admin;

commit;
