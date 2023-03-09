-- Deploy ccbc:computed_columns/application_history to pg

begin;

create or replace function ccbc_public.application_history(application ccbc_public.application) 
RETURNS SETOF ccbc_public.history_item
AS $$
    delete from ccbc_public.history_item where application_id=application.id;

    -- first get all simple inserts
    insert into ccbc_public.history_item
    select application.id, v.created_at, v.op, v.table_name, v.record_id, v.record, 'application' as item,
        u.family_name, u.given_name, u.session_sub
    from ccbc_public.record_version as v 
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application' and v.record->>'id'=application.id::varchar(10) ;

    insert into ccbc_public.history_item
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.record->>'status' as item,
        u.family_name, u.given_name, u.session_sub
    from ccbc_public.record_version as v 
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_status' 
        and v.record->>'application_id'=application.id::varchar(10);

    insert into ccbc_public.history_item
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.record->>'file_name' as item,
        u.family_name, u.given_name, u.session_sub
    from ccbc_public.record_version as v 
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='attachment' 
        and v.record->>'application_id'=application.id::varchar(10) and v.record->>'archived_by' is null;

    insert into ccbc_public.history_item
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.record->>'assessment_data_type' as item,
        u.family_name, u.given_name, u.session_sub
    from ccbc_public.record_version as v 
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='assessment_data' 
        and v.record->>'application_id'=application.id::varchar(10) and v.record->>'archived_by' is null;

    -- now get double-removed (rfi)
    -- for current_rfi in
    --     select rd.id from ccbc_public.rfi_data as rd
    --     inner join ccbc_public.application_rfi_data arf
    --     on arf.rfi_data_id = rd.id
    --     where arf.application_id = application.id;

    -- loop
   
    --     insert into ccbc_public.history_item
    --     select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, 
    --         v.record-> 'json_data' ->>'rfiType' as item,
    --         u.family_name, u.given_name, u.session_sub    
    --     from ccbc_public.record_version as v 
    --         inner join ccbc_public.ccbc_user u on v.created_by=u.id
    --     where v.op='INSERT' and v.table_name='rfi_data' 
    --         and v.record->>'id'=current_rfi.id::varchar(10) and v.record->>'archived_by' is null;
    --     end loop;

    select row(hi.*) from ccbc_public.history_item as hi where application_id=application.id order by created_at asc;

$$ language sql volatile;

grant execute on function ccbc_public.application_history to ccbc_admin;
grant execute on function ccbc_public.application_history to ccbc_analyst;

comment on function ccbc_public.application_history is 'Computed column that returns list of audit records for application';

commit;