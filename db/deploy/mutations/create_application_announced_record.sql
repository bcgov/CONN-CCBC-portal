-- Deploy ccbc:mutations/create_application_announced_record to pg

BEGIN;


create or replace function ccbc_public.create_application_announced_record(_application_id int, is_announced boolean)
returns ccbc_public.application_announced as $$
declare
  new_id int;
begin

  insert into ccbc_public.application_announced (application_id, announced)
    values (_application_id, is_announced) returning id into new_id;

  -- archive the old internal description
  if exists (select * from ccbc_public.application_announced where application_id = _application_id and archived_at is null)
    then update ccbc_public.application_announced
    set archived_at = now() where application_id = _application_id and archived_at is null and id != new_id;
  end if;

  return (select row(ccbc_public.application_announced.*)
  from ccbc_public.application_announced
  where id = new_id);

end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_application_announced_record to ccbc_analyst;
grant execute on function ccbc_public.create_application_announced_record to ccbc_admin;

COMMIT;
