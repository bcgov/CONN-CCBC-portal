-- Deploy ccbc:mutations/create_project_information to pg

begin;

drop function if exists ccbc_public.create_project_information;

create or replace function ccbc_public.create_project_information(_application_id int, _json_data jsonb)
returns ccbc_public.project_information_data as $$
declare
new_project_information_id int;
old_project_information_id int;
old_project_information_json_data jsonb;
_sow_id int;
begin

  select pi.id, json_data into old_project_information_id, old_project_information_json_data from ccbc_public.project_information_data as pi where pi.application_id = _application_id
  order by pi.id desc limit 1;

-- if the statementOfWorkUpload is not availabel or if it is null
  if(not (_json_data ? 'statementOfWorkUpload') or jsonb_typeof(_json_data -> 'statementOfWorkUpload') = 'null') then
  -- need to check that the application sow data isn't already archived
    update ccbc_public.application_sow_data set archived_at = now() where application_id = _application_id
      and (amendment_number is null or amendment_number = 0) --Check if it's an original sow_upload rather than the
      and archived_at is null
      returning id into _sow_id;

    if exists (select * from ccbc_public.sow_tab_1 where sow_id = _sow_id and archived_at is null)
      then update ccbc_public.sow_tab_1 set archived_at = now() where sow_id = _sow_id and archived_at is null;
    end if;

    if exists (select * from ccbc_public.sow_tab_2 where sow_id = _sow_id and archived_at is null)
      then update ccbc_public.sow_tab_2 set archived_at = now() where sow_id = _sow_id and archived_at is null;
    end if;

    if exists (select * from ccbc_public.sow_tab_7 where sow_id = _sow_id and archived_at is null)
      then update ccbc_public.sow_tab_7 set archived_at = now() where sow_id = _sow_id and archived_at is null;
    end if;

    if exists (select * from ccbc_public.sow_tab_8 where sow_id = _sow_id and archived_at is null)
      then update ccbc_public.sow_tab_8 set archived_at = now() where sow_id = _sow_id and archived_at is null;
    end if;

  end if;

  if exists (select * from ccbc_public.project_information_data where id = old_project_information_id)
    then update ccbc_public.project_information_data set archived_at = now() where id = old_project_information_id;
  end if;

  insert into ccbc_public.project_information_data (application_id, json_data)
    values (_application_id, _json_data) returning id into new_project_information_id;


  return (select row(ccbc_public.project_information_data.*) from ccbc_public.project_information_data
    where id = new_project_information_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_project_information to ccbc_analyst;
grant execute on function ccbc_public.create_project_information to ccbc_admin;

commit;
