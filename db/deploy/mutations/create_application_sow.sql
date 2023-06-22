-- Deploy ccbc:mutations/create_application_sow to pg

BEGIN;

create or replace function ccbc_public.create_application_sow(_application_id int, _json_data jsonb)
returns ccbc_public.application_sow_data as $$
declare
new_application_sow_data_id int;
old_application_sow_data_id int;
begin

  select sd.id into old_application_sow_data_id from ccbc_public.application_sow_data as sd where sd.application_id = _application_id
  order by sd.id desc limit 1;

  insert into ccbc_public.application_sow_data (application_id, json_data)
    values (_application_id, _json_data) returning id into new_application_sow_data_id;

  -- archive sow data
  if exists (select * from ccbc_public.application_sow_data where id = old_application_sow_data_id)
    then update ccbc_public.application_sow_data set archived_at = now() where id = old_application_sow_data_id;
  end if;

  -- archive all the sow tabs related to the old sow id
  if exists (select * from ccbc_public.sow_tab_1 where sow_id = old_application_sow_data_id)
    then update ccbc_public.sow_tab_1 set archived_at = now() where sow_id = old_application_sow_data_id;
  end if;

  if exists (select * from ccbc_public.sow_tab_2 where sow_id = old_application_sow_data_id)
    then update ccbc_public.sow_tab_2 set archived_at = now() where sow_id = old_application_sow_data_id;
  end if;

  if exists (select * from ccbc_public.sow_tab_7 where sow_id = old_application_sow_data_id)
    then update ccbc_public.sow_tab_7 set archived_at = now() where sow_id = old_application_sow_data_id;
  end if;

  if exists (select * from ccbc_public.sow_tab_8 where sow_id = old_application_sow_data_id)
    then update ccbc_public.sow_tab_8 set archived_at = now() where sow_id = old_application_sow_data_id;
  end if;

  return (select row(ccbc_public.application_sow_data.*) from ccbc_public.application_sow_data
    where id = new_application_sow_data_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_application_sow to ccbc_analyst;
grant execute on function ccbc_public.create_application_sow to ccbc_admin;

COMMIT;
