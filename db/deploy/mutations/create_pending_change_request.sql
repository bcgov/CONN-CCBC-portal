-- Deploy ccbc:mutations/create_pending_change_request.sql to pg

begin;

create or replace function ccbc_public.create_pending_change_request(_application_id int,  _is_pending boolean, _comment varchar default null) returns ccbc_public.application_pending_change_request as $$
declare
new_request_id int;
begin

  insert into ccbc_public.application_pending_change_request (application_id, comment, is_pending)
    values (_application_id, _comment, _is_pending) returning id into new_request_id;

  update ccbc_public.application_pending_change_request
  set archived_at = now()
  where application_id = _application_id and archived_at is null and id != new_request_id;

  return (select row(ccbc_public.application_pending_change_request.*) from ccbc_public.application_pending_change_request where id = new_request_id);

end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_pending_change_request to ccbc_analyst;
grant execute on function ccbc_public.create_pending_change_request to ccbc_admin;

commit;
