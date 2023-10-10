-- Deploy ccbc:mutations/create_application_internal_description to pg

begin;

create or replace function ccbc_public.create_application_internal_description(_application_id int, _description text)
returns ccbc_public.application_internal_description as $$
declare
  new_id int;
begin

  insert into ccbc_public.application_internal_description (application_id, description)
    values (_application_id, _description) returning id into new_id;

  -- archive the old internal description
  if exists (select * from ccbc_public.application_internal_description where application_id = _application_id and archived_at is null)
    then update ccbc_public.application_internal_description
    set archived_at = now() where application_id = _application_id and archived_at is null and id != new_id;
  end if;

  return (select row(ccbc_public.application_internal_description.*)
  from ccbc_public.application_internal_description
  where id = new_id);

end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_application_internal_description to ccbc_analyst;
grant execute on function ccbc_public.create_application_internal_description to ccbc_admin;

commit;
