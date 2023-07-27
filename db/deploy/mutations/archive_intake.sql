-- Deploy ccbc:mutations/archive_intake to pg

begin;

create or replace function ccbc_public.archive_intake(intake_number int) returns ccbc_public.intake as
$$
declare
  open_date timestamp with time zone;
  close_date timestamp with time zone;
begin
    select open_timestamp, close_timestampt into open_date, close_date
    from ccbc_public.intake where ccbc_intake_number = intake_number;

    if open_date < now() or close_date < now() then
        raise exception 'Cannot archive previous or current intakes';
    end if;

    update ccbc_public.intake
    set archived_at = now()
    where ccbc_intake_number = intake_number
    and archived_at is null;
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.archive_intake to ccbc_admin;

comment on function ccbc_public.archive_intake is 'Function to archive intake';

commit;
