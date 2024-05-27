-- Deploy ccbc:mutations/create_pending_change_request.sql to pg

begin;

create or replace function ccbc_public.create_pending_change_request(_is_pending boolean, _application_id int default null, _cbc_id int default null, _comment varchar default null) returns ccbc_public.application_pending_change_request as $$
declare
new_request_id int;
old_request_id int;
begin

  if _application_id is not null then
    select req.id into old_request_id from ccbc_public.application_pending_change_request as req where req.application_id = _application_id
    order by req.id desc limit 1;
  elsif _cbc_id is not null then
    select req.id into old_request_id from ccbc_public.application_pending_change_request as req where req.cbc_id = _cbc_id
    order by req.id desc limit 1;
  end if;

  insert into ccbc_public.application_pending_change_request (application_id, cbc_id, comment, is_pending)
    values (_application_id, _cbc_id, _comment, _is_pending) returning id into new_request_id;

  if exists (select * from ccbc_public.application_pending_change_request where id = old_request_id)
    then update ccbc_public.application_pending_change_request set archived_at = now() where id = old_request_id;
  end if;

  return (select row(ccbc_public.application_pending_change_request.*) from ccbc_public.application_pending_change_request where id = new_request_id);

end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_pending_change_request to ccbc_analyst;
grant execute on function ccbc_public.create_pending_change_request to ccbc_admin;

commit;
