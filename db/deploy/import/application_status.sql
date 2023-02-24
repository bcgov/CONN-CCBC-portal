-- Deploy ccbc:import/application_status to pg

BEGIN;
create or replace function ccbc_public.import_application_statuses() returns table(result_id int)
as $function$
    declare
        current_app    ccbc_public.application_status%ROWTYPE;
        cnt             int;
        table_oid       int;
	    application_statuses    refcursor;
        pkey_cols       text[];  
        record_jsonb    jsonb; 
        record_id       uuid;  
    begin
    select count(*) into cnt from ccbc_public.application_status;
    select oid into table_oid from  pg_class where relname='application_status';
    pkey_cols := audit.primary_key_columns(table_oid);
    open application_statuses for select *
		    from ccbc_public.application_status;

    loop
        fetch application_statuses into current_app;
        exit when not found;
        record_jsonb := to_jsonb(current_app);
        record_id := audit.to_record_id(table_oid, pkey_cols, record_jsonb);
        insert into ccbc_public.record_version(
                record_id, 
                op,
                table_oid,
                table_schema,
                table_name,
                created_by,
                created_at,
                record
                )
            select
                record_id,
                'INSERT',
                table_oid,
                'ccbc_public',
                'application_status',
                created_by,
                created_at,
                record_jsonb from ccbc_public.application_status 
            where record_jsonb not in 
                (select record_jsonb from ccbc_public.record_version 
                where table_name='application_status' and op = 'INSERT');
        
    end loop;

    close application_statuses;

    return query select cnt as result_id; 
end;
$function$ language plpgsql volatile;
grant execute on function ccbc_public.import_application_statuses to ccbc;
COMMIT;

