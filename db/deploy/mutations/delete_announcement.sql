-- Deploy ccbc:mutations/delete_announcement to pg

begin;

create or replace function ccbc_public.delete_announcement(announcement_row_id int, application_row_id int, json_data jsonb) returns ccbc_public.announcement as $$
declare
    user_sub varchar;
    user_id int;
begin
    user_sub := (select sub from ccbc_public.session());
    user_id := (select id from ccbc_public.ccbc_user where ccbc_user.session_sub = user_sub);

    if (application_row_id = -1) then
        update ccbc_public.announcement set archived_at = now(), archived_by = user_id
            where id = announcement_row_id;
        update ccbc_public.application_announcement  set archived_at = now(), archived_by = user_id
            where announcement_id = announcement_row_id;
    else
        update ccbc_public.announcement set json_data = json_data
            where id = announcement_row_id;
        update ccbc_public.application_announcement  set archived_at = now(), archived_by = user_id
            where announcement_id = announcement_row_id and application_id = application_row_id;
    end if;
    return (select row(ccbc_public.announcement.*) from ccbc_public.announcement where id = announcement_row_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.delete_announcement to ccbc_analyst;
grant execute on function ccbc_public.delete_announcement to ccbc_admin;

commit;
