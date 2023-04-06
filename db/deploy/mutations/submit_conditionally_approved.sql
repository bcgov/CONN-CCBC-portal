-- Deploy ccbc:mutations/submit_conditionally_approved to pg

begin;

create or replace function ccbc_public.submit_conditionally_approved(_application_id int, _json_data jsonb, new_application_status text)
returns ccbc_public.conditional_approval_data as $$
declare
new_conditional_approval_id int;
begin

  select id into new_conditional_approval_id from ccbc_public.create_conditional_approval(_application_id, _json_data);

  if (new_application_status = 'Conditionally Approved') then
    insert into ccbc_public.application_status (application_id, status) values (_application_id, 'applicant_conditionally_approved');
  end if;

  if (new_application_status = 'Received') then
    insert into ccbc_public.application_status (application_id, status) values (_application_id, 'applicant_received');
  end if;

  return (select row(ccbc_public.conditional_approval_data.*) from ccbc_public.conditional_approval_data where id = new_conditional_approval_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.submit_conditionally_approved to ccbc_analyst;
grant execute on function ccbc_public.submit_conditionally_approved to ccbc_admin;

commit;
