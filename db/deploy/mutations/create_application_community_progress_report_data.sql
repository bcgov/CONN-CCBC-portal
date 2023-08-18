-- Deploy ccbc:mutations/create_application_community_progress_report_data to pg

begin;

create or replace function ccbc_public.create_application_community_progress_report_data(
    _application_id integer,
    _json_data jsonb,
    _old_community_progress_report_id integer default null,
    _excel_data_id integer default null
) returns ccbc_public.application_community_progress_report_data as $$
declare
  new_id integer;
  old_excel_data_id int;
begin

  insert into ccbc_public.application_community_progress_report_data (application_id, excel_data_id, json_data)
  values (_application_id, _excel_data_id, _json_data)
  returning id into new_id;

  if exists (select * from ccbc_public.application_community_progress_report_data where id = _old_community_progress_report_id)
    then update ccbc_public.application_community_progress_report_data set archived_at = now() where id = _old_community_progress_report_id returning excel_data_id into old_excel_data_id;
  end if;

   if(not (_json_data ? 'progressReportFile') or jsonb_typeof(_json_data -> 'progressReportFile') = 'null') then
      update ccbc_public.application_community_report_excel_data set archived_at = now() where id = old_excel_data_id;
   end if;

  return (select row(ccbc_public.application_community_progress_report_data.*)
    from ccbc_public.application_community_progress_report_data
    where id = new_id);

end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_application_community_progress_report_data to ccbc_analyst;
grant execute on function ccbc_public.create_application_community_progress_report_data to ccbc_admin;

commit;
