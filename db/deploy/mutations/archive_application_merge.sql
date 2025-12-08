-- Deploy ccbc:mutations/archive_application_merge to pg

begin;

drop function if exists ccbc_public.archive_application_merge(_child_application_id int);
create or replace function ccbc_public.archive_application_merge(_child_application_id int, _change_reason text default null) returns ccbc_public.application_merge as $$
declare
  archived_merge ccbc_public.application_merge;
begin
  update ccbc_public.application_merge set archived_at = now(), change_reason = _change_reason where child_application_id = _child_application_id and archived_at is null returning * into archived_merge;

  return archived_merge;
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.archive_application_merge to ccbc_analyst;
grant execute on function ccbc_public.archive_application_merge to ccbc_admin;
grant execute on function ccbc_public.archive_application_merge to cbc_admin;

commit;
