-- Deploy ccbc:mutations/create_conditional_approval to pg

begin;

create or replace function ccbc_public.create_conditional_approval(_application_id int, _json_data jsonb)
returns ccbc_public.conditional_approval_data as $$
declare
new_conditional_approval_id int;
old_conditional_approval_id int;
begin

  select cp.id into old_conditional_approval_id from ccbc_public.conditional_approval_data as cp where cp.application_id = _application_id
  order by cp.id desc limit 1;

  insert into ccbc_public.conditional_approval_data (application_id, json_data)
    values (_application_id, _json_data) returning id into new_conditional_approval_id;

  if exists (select * from ccbc_public.conditional_approval_data where id = old_conditional_approval_id)
    then update ccbc_public.conditional_approval_data set archived_at = now() where id = old_conditional_approval_id;
  end if;

  return (select row(ccbc_public.conditional_approval_data.*) from ccbc_public.conditional_approval_data where id = new_conditional_approval_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_conditional_approval to ccbc_analyst;
grant execute on function ccbc_public.create_conditional_approval to ccbc_admin;

commit;
