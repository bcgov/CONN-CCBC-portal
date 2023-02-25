-- Deploy ccbc:import/assessment_data to pg

BEGIN;

create or replace function ccbc_public.import_assessment_data() returns table(result_id int)
as $function$
    declare
        current_app    ccbc_public.assessment_data%ROWTYPE;
        cnt             int;
        table_oid       int;
	    assessment_data_rows    refcursor;
        pkey_cols       text[];  
        record_jsonb    jsonb; 
        record_id       uuid;  
    begin
    select count(*) into cnt from ccbc_public.assessment_data;
    select oid into table_oid from  pg_class where relname='assessment_data';
    pkey_cols := audit.primary_key_columns(table_oid);
    open assessment_data_rows for select *
		    from ccbc_public.assessment_data;

    loop
        fetch assessment_data_rows into current_app;
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
                'assessment_data',
                created_by,
                created_at,
                record_jsonb from ccbc_public.assessment_data 
            where record_jsonb not in 
                (select record_jsonb from ccbc_public.record_version 
                where table_name='assessment_data' and op = 'INSERT');
        
    end loop;

    close assessment_data_rows;

    return query select cnt as result_id; 
end;
$function$ language plpgsql volatile;
-- grant execute on function ccbc_public.import_assessment_data to ccbc;
COMMIT;
