-- Deploy ccbc:mutations/create_change_request to pg

begin;

create or replace function ccbc_public.create_change_request(_application_id int, _change_request_number int, _json_data jsonb)
returns ccbc_public.change_request_data as $$
declare
new_change_request_id int;
new_change_request_number int;
begin

  select count(*) into new_change_request_number from ccbc_public.change_request_data as cr where cr.application_id = _application_id and archived_at is null;

  if new_change_request_number = 0 then
    new_change_request_number := 1;
  else
    new_change_request_number := new_change_request_number + 1;
  end if;

  if _change_request_number != new_change_request_number then
    raise exception 'Change request number % does not match expected number %', _change_request_number, new_change_request_number;
  end if;

  insert into ccbc_public.change_request_data (application_id, change_request_number, json_data)
    values (_application_id, new_change_request_number, _json_data) returning id into new_change_request_id;

  return (select row(ccbc_public.change_request_data.*) from ccbc_public.change_request_data
    where id = new_change_request_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_change_request to ccbc_analyst;
grant execute on function ccbc_public.create_change_request to ccbc_admin;

commit;
