-- Deploy ccbc:mutations/create_application_sow_data to pg

begin;

drop function if exists ccbc_public.create_application_sow_data;

create or replace function ccbc_public.create_application_sow_data(_application_id int, _json_data jsonb, _amendment_number int, _history_operation text)
returns ccbc_public.application_sow_data as $$
declare
new_application_sow_data_id int;
old_application_sow_data_id int;
sow_amendment_number int;
sow_is_amendment boolean;
begin

  if _amendment_number is null or _amendment_number = 0
    then
      sow_amendment_number := 0;
      sow_is_amendment := false;
    else
      sow_amendment_number := _amendment_number;
      sow_is_amendment := true;
  end if;

  select asd.id into old_application_sow_data_id from ccbc_public.application_sow_data as asd
  where asd.application_id = _application_id
  and asd.amendment_number = sow_amendment_number
  and archived_at is null
  order by asd.id desc limit 1;

  insert into ccbc_public.application_sow_data (application_id, json_data, amendment_number, is_amendment, history_operation)
    values (_application_id, _json_data, sow_amendment_number, sow_is_amendment, _history_operation) returning id into new_application_sow_data_id;

  -- archive the old sow data
  if exists (select * from ccbc_public.application_sow_data where id = old_application_sow_data_id)
    then update ccbc_public.application_sow_data set archived_at = now(), history_operation = _history_operation where id = old_application_sow_data_id;
  end if;

 -- archive all the sow tabs related to the old sow id
  if exists (select * from ccbc_public.sow_tab_1 where sow_id = old_application_sow_data_id)
    then update ccbc_public.sow_tab_1 set archived_at = now();
  end if;

  if exists (select * from ccbc_public.sow_tab_2 where sow_id = old_application_sow_data_id)
    then update ccbc_public.sow_tab_2 set archived_at = now();
  end if;

  if exists (select * from ccbc_public.sow_tab_7 where sow_id = old_application_sow_data_id)
    then update ccbc_public.sow_tab_7 set archived_at = now();
  end if;

  if exists (select * from ccbc_public.sow_tab_8 where sow_id = old_application_sow_data_id)
    then update ccbc_public.sow_tab_8 set archived_at = now();
  end if;

  return (select row(ccbc_public.application_sow_data.*) from ccbc_public.application_sow_data where id = new_application_sow_data_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_application_sow_data to ccbc_analyst;
grant execute on function ccbc_public.create_application_sow_data to ccbc_admin;

commit;
