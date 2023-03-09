-- Deploy ccbc:computed_columns/application_history to pg

begin;

create or replace function ccbc_public.application_history(application ccbc_public.application) 
returns setof ccbc_public.history_item as $function$
-- declare
--         current_rfi ccbc_public.rfi_data%ROWTYPE;
-- 	    rfi_entries refcursor;  
begin
    create temporary table tmp_history
    (
    application_id integer, 
    created_at timestamptz,  
    op audit.operation,  
    table_name name,  
    record_id uuid,  
    record jsonb,  
    item varchar,  
    family_name varchar,  
    given_name varchar,  
    session_sub varchar
    );

    -- first get all simple inserts
    insert into tmp_history
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, 'application' as item,
        u.family_name, u.given_name, u.session_sub
    from ccbc_public.record_version as v 
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application' and v.record->>'id'=application.id::varchar(10) ;

    insert into tmp_history
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.record->>'status' as item,
        u.family_name, u.given_name, u.session_sub
    from ccbc_public.record_version as v 
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_status' 
        and v.record->>'id'=application.id::varchar(10);

    insert into tmp_history
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.record->>'file_name' as item,
        u.family_name, u.given_name, u.session_sub
    from ccbc_public.record_version as v 
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='attachment' 
        and v.record->>'id'=application.id::varchar(10) and v.record->>'archived_by' is null;

    insert into tmp_history
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.record->>'assessment_data_type' as item,
        u.family_name, u.given_name, u.session_sub
    from ccbc_public.record_version as v 
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='assessment_data' 
        and v.record->>'id'=application.id::varchar(10) and v.record->>'archived_by' is null;


    -- open rfi_entries for 
    --     select rd.id from ccbc_public.rfi_data as rd
    --     inner join ccbc_public.application_rfi_data arf
    --     on arf.rfi_data_id = rd.id
    --     where arf.application_id = application.id;

    -- loop
    --     fetch rfi_entries into current_rfi;
    --     exit when not found;

    --     insert into tmp_history
    --     select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, 
    --         v.record-> 'json_data' ->>'rfiType' as item,
    --         u.family_name, u.given_name, u.session_sub    
    --     from ccbc_public.record_version as v 
    --         inner join ccbc_public.ccbc_user u on v.created_by=u.id
    --     where v.op='INSERT' and v.table_name='rfi_data' 
    --         and v.record->>'id'=current_rfi.id::varchar(10) and v.record->>'archived_by' is null;
    --     end loop;

    return query select 
    hi.application_id,  hi.created_at, hi.op, hi.table_name, hi.record_id, hi.record, hi.item,
        hi.family_name, hi.given_name, hi.session_sub
        from tmp_history as hi where hi.application_id=application.id order by created_at asc;
end;
$function$ language plpgsql;

grant execute on function ccbc_public.application_history to ccbc_admin;
grant execute on function ccbc_public.application_history to ccbc_analyst;

comment on function ccbc_public.application_history is 'Computed column that returns list of audit records for application';

commit;