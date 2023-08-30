-- Deploy ccbc:mutations/delete_community_progress_report to pg


begin;

create or replace function ccbc_public.delete_community_progress_report(cpr_row_id int, application_row_id int, form_data jsonb) returns ccbc_public.application_community_progress_report_data as $$
declare
    user_sub varchar;
    user_id int;
begin
    user_sub := (select sub from ccbc_public.session());
    user_id := (select id from ccbc_public.ccbc_user where ccbc_user.session_sub = user_sub);
    
    update ccbc_public.application_community_progress_report_data  set archived_at = now(), archived_by = user_id, 
        history_operation = 'deleted'
        where id = cpr_row_id and application_id = application_row_id;

    return (select row(ccbc_public.application_community_progress_report_data.*) 
        from ccbc_public.application_community_progress_report_data where id = cpr_row_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.delete_community_progress_report to ccbc_analyst;
grant execute on function ccbc_public.delete_community_progress_report to ccbc_admin;

commit;
