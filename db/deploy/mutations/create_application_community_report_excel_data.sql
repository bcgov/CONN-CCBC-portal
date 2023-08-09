-- Deploy ccbc:mutations/create_application_community_report_excel_data to pg

begin;

drop function if exists ccbc_public.create_application_community_report_excel_data cascade;

create or replace function ccbc_public.create_application_community_report_excel_data(_application_id int, _json_data jsonb, _old_id int default null)
returns ccbc_public.application_community_report_excel_data as $$
declare
new_id int;
begin

  insert into ccbc_public.application_community_report_excel_data (application_id, json_data)
    values (_application_id, _json_data) returning id into new_id;

  -- archive the old community progress excel data
  if exists (select * from ccbc_public.application_community_report_excel_data where id = _old_id and archived_at is null)
    then update ccbc_public.application_community_report_excel_data
    set archived_at = now() where id = _old_id;
  end if;

  return (select row(ccbc_public.application_community_report_excel_data.*)
  from ccbc_public.application_community_report_excel_data
  where id = new_id);

end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_application_community_report_excel_data to ccbc_analyst;
grant execute on function ccbc_public.create_application_community_report_excel_data to ccbc_admin;

commit;
