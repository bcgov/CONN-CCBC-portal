-- Deploy ccbc:mutations/create_change_request to pg

begin;

create or replace function ccbc_public.create_change_request(_application_id int, _json_data jsonb)
returns ccbc_public.change_request_data as $$
declare
new_change_request_id int;
old_change_request_id int;
begin

  select cr.id into old_change_request_id from ccbc_public.change_request_data as cr where cr.application_id = _application_id
  order by cr.id desc limit 1;

  insert into ccbc_public.change_request_data (application_id, json_data)
    values (_application_id, _json_data) returning id into new_change_request_id;

  if exists (select * from ccbc_public.change_request_data where id = old_change_request_id)
    then update ccbc_public.change_request_data set archived_at = now() where id = old_change_request_id;
  end if;

  return (select row(ccbc_public.change_request_data.*) from ccbc_public.change_request_data
    where id = new_change_request_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_change_request to ccbc_analyst;
grant execute on function ccbc_public.create_change_request to ccbc_admin;

commit;
