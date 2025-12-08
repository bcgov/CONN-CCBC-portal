-- Deploy ccbc:mutations/merge_application to pg

begin;

-- drop the newer overloaded version with change_reason so the grant below is unambiguous
drop function if exists ccbc_public.merge_application;

create or replace function ccbc_public.merge_application(_child_application_id int, _parent_application_id int default null,  _parent_cbc_id int default null) returns ccbc_public.application_merge as $$
declare
  new_application_merge_id int;
  old_application_merge_id int;
begin
  -- enforce exactly one parent source
  if (_parent_application_id is null and _parent_cbc_id is null)
     or (_parent_application_id is not null and _parent_cbc_id is not null) then
    raise exception
      'Exactly one of _parent_application_id or _parent_cbc_id must be provided';
  end if;

  select am.id into old_application_merge_id from ccbc_public.application_merge as am where am.child_application_id = _child_application_id and am.archived_at is null
  order by am.id desc limit 1;

  insert into ccbc_public.application_merge (child_application_id, parent_application_id,  parent_cbc_id)
    values (_child_application_id, _parent_application_id, _parent_cbc_id) returning id into new_application_merge_id;

  if old_application_merge_id is not null then
    update ccbc_public.application_merge set archived_at = now() where id = old_application_merge_id;
  end if;

  return (select row(ccbc_public.application_merge.*) from ccbc_public.application_merge where id = new_application_merge_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.merge_application(_child_application_id int, _parent_application_id int,  _parent_cbc_id int) to ccbc_analyst;
grant execute on function ccbc_public.merge_application(_child_application_id int, _parent_application_id int,  _parent_cbc_id int) to ccbc_admin;
grant execute on function ccbc_public.merge_application(_child_application_id int, _parent_application_id int,  _parent_cbc_id int) to cbc_admin;

commit;
