-- Deploy ccbc:mutations/archive_application_sow to pg

begin;

drop function if exists ccbc_public.archive_application_sow;

create or replace function ccbc_public.archive_application_sow(_application_id int)
returns void as $$
declare
    sow_data_ids int[];
    sow_data_id int;
begin
    -- Select all the IDs that belong to the application_id
    sow_data_ids := array(
        select sd.id
        from ccbc_public.application_sow_data as sd
        where sd.application_id = _application_id
    );

    -- Update archived_at for non-archived records in application_sow_data table
    update ccbc_public.application_sow_data
    set archived_at = now()
    where application_id = _application_id
    and archived_at is null;

    -- Loop through the selected IDs
    foreach sow_data_id in array sow_data_ids loop
        -- Update archived_at on all the tabs for the current sow_data_id if it is null
        update ccbc_public.sow_tab_1
        set archived_at = now()
        where sow_id = sow_data_id
        and archived_at is null;

        update ccbc_public.sow_tab_2
        set archived_at = now()
        where sow_id = sow_data_id
        and archived_at is null;

        update ccbc_public.sow_tab_7
        set archived_at = now()
        where sow_id = sow_data_id
        and archived_at is null;

        update ccbc_public.sow_tab_8
        set archived_at = now()
        where sow_id = sow_data_id
        and archived_at is null;
    end loop;
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.archive_application_sow to ccbc_analyst;
grant execute on function ccbc_public.archive_application_sow to ccbc_admin;

begin;
