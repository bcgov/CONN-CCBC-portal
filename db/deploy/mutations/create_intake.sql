-- Deploy ccbc:mutations/create_intake to pg

begin;

create or replace function ccbc_public.create_intake(start_time timestamp with time zone, end_time timestamp with time zone, ccbc_number int) returns ccbc_public.intake as $$
declare
  result ccbc_public.intake;
  new_counter_id int;
begin
  insert into ccbc_public.gapless_counter (counter) values (0) returning id into new_counter_id;
  insert into ccbc_public.intake (open_timestamp, close_timestamp, ccbc_intake_number, counter_id) values (start_time, end_time, ccbc_number, new_counter_id) returning * into result;

  return result;
end;
$$ language plpgsql strict volatile;

comment on function ccbc_public.create_intake is 'Function to create intakes for the ccbc admin';

grant execute on function ccbc_public.create_intake to ccbc_admin;

commit;
