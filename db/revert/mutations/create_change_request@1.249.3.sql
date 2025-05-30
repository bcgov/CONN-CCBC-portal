-- Deploy ccbc:mutations/create_change_request to pg

begin;

drop function if exists ccbc_public.create_change_request(int, int, jsonb);

create or replace function ccbc_public.create_change_request(_application_id int, _amendment_number int, _json_data jsonb, _old_change_request_id int default null)
returns ccbc_public.change_request_data as $$
declare
new_change_request_id int;
begin
  insert into ccbc_public.change_request_data (application_id, amendment_number, json_data)
    values (_application_id, _amendment_number, _json_data) returning id into new_change_request_id;

 if exists (select * from ccbc_public.change_request_data where id = _old_change_request_id)
    then update ccbc_public.change_request_data set archived_at = now() where id = _old_change_request_id;
  end if;

  return (select row(ccbc_public.change_request_data.*) from ccbc_public.change_request_data
    where id = new_change_request_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_change_request to ccbc_analyst;
grant execute on function ccbc_public.create_change_request to ccbc_admin;

commit;
