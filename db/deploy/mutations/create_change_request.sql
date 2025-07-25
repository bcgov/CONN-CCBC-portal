-- Deploy ccbc:mutations/create_change_request to pg

begin;

drop function if exists ccbc_public.create_change_request;

create or replace function ccbc_public.create_change_request(_application_id int, _amendment_number int, _json_data jsonb, _old_change_request_id int default null, _history_operation text default 'INSERT')
returns ccbc_public.change_request_data as $$
declare
new_change_request_id int;
old_change_request_json_data jsonb;
_sow_id int;
begin
  insert into ccbc_public.change_request_data (application_id, amendment_number, json_data, history_operation)
    values (_application_id, _amendment_number, _json_data, _history_operation) returning id into new_change_request_id;

  select json_data into old_change_request_json_data from ccbc_public.change_request_data where id = _old_change_request_id;

 if exists (select * from ccbc_public.change_request_data where id = _old_change_request_id)
    then update ccbc_public.change_request_data set archived_at = now(), history_operation = _history_operation where id = _old_change_request_id;
  end if;

  if(not (_json_data ? 'statementOfWorkUpload') or jsonb_typeof(_json_data -> 'statementOfWorkUpload') = 'null') then
-- need to check that the application sow data isn't already archived
    update ccbc_public.application_sow_data set archived_at = now(), history_operation = _history_operation where application_id = _application_id
      and amendment_number = _amendment_number --Check if it's the same amendment number, so we're only archiving the same change request
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

  return (select row(ccbc_public.change_request_data.*) from ccbc_public.change_request_data
    where id = new_change_request_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_change_request to ccbc_analyst;
grant execute on function ccbc_public.create_change_request to ccbc_admin;

commit;
