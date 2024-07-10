-- Revert ccbc:mutations/update_intake from pg

begin;

drop function if exists ccbc_public.update_intake(intake_number int, start_time timestamp with time zone, end_time timestamp with time zone, intake_description text);

commit;
