-- Deploy ccbc:mutations/archive_application_milestone_data to pg

begin;

create or replace function ccbc_public.archive_application_milestone_data(_milestone_id integer)
returns void as $$
declare
  user_sub varchar;
  user_id  int;
  _excel_data_id integer;
begin
  user_sub := (select sub from ccbc_public.session());
  user_id := (select id from ccbc_public.ccbc_user where ccbc_user.session_sub = user_sub);

  select excel_data_id into _excel_data_id from ccbc_public.application_milestone_data
  where id = _milestone_id;

  -- archive the old milestone excel data
  if exists (select * from ccbc_public.application_milestone_excel_data where id = _excel_data_id)
    then update ccbc_public.application_milestone_excel_data
    set archived_at = now(), archived_by = user_id
    where id = _excel_data_id;
  end if;

  -- archive the milestone
  update ccbc_public.application_milestone_data
  set archived_at = now(), archived_by = user_id,
        history_operation = 'deleted'
  where id = _milestone_id
  and archived_at is null;

end

$$ language plpgsql;

grant execute on function ccbc_public.archive_application_milestone_data to ccbc_analyst, ccbc_admin;

comment on function ccbc_public.archive_application_milestone_data is 'Mutation to archive an application milestone as well as the excel data';

commit;
