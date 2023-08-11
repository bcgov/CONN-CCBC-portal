-- Deploy ccbc:mutations/create_application_community_report_excel_data to pg

begin;

create or replace function ccbc_public.create_application_community_report_excel_data(_application_id int, _json_data jsonb)
returns ccbc_public.application_community_report_excel_data as $$
declare
new_id int;
old_id int;
begin

  select id into old_id from ccbc_public.application_community_report_excel_data
  where application_id = _application_id
  and archived_at is null
  order by id desc limit 1;

  insert into ccbc_public.application_community_report_excel_data (application_id, json_data)
    values (_application_id, _json_data) returning id into new_id;

  -- archive the old sow data
  if exists (select * from ccbc_public.application_community_report_excel_data where id = old_id)
    then update ccbc_public.application_community_report_excel_data
    set archived_at = now() where id = old_id;
  end if;

  return (select row(ccbc_public.application_community_report_excel_data.*)
  from ccbc_public.application_community_report_excel_data
  where id = new_id);

end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_application_community_report_excel_data to ccbc_analyst;
grant execute on function ccbc_public.create_application_community_report_excel_data to ccbc_admin;

commit;
