-- Deploy ccbc:mutations/submit_application to pg

begin;

create or replace function ccbc_public.set_current_date(mocked_timestamp timestamptz)
  returns void as $$
declare
begin

  execute mocks.set_mocked_time(timestamptz);

  return;
end;

$$ language plpgsql;

grant execute on function ccbc_public.set_current_date to ccbc_auth_user;


commit;
