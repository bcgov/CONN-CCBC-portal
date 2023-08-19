-- Deploy ccbc:import/application_community_progress_report to pg

BEGIN;

create or replace function ccbc_public.import_application_community_progress_report_records() returns table(result_id int)
as $function$
    declare
        current_app    ccbc_public.application_community_progress_report_data%ROWTYPE;
        cnt             int;
        table_oid       int;
	    application_community_progress_report_records    refcursor;
        pkey_cols       text[];  
        record_jsonb    jsonb; 
        record_id       uuid;  
    begin
    delete from ccbc_public.record_version where table_name='application_community_progress_report_data' and op='INSERT';
    select count(*) into cnt from ccbc_public.application_community_progress_report_data;
    select oid into table_oid from  pg_class where relname='application_community_progress_report_data';
    pkey_cols := audit.primary_key_columns(table_oid);
    open application_community_progress_report_records for select *
		    from ccbc_public.application_community_progress_report_data where archived_by is null;

    loop
        fetch application_community_progress_report_records into current_app;
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
                'application_community_progress_report_data',
                created_by,
                created_at,
                record_jsonb from ccbc_public.application_community_progress_report_data 
            where id = current_app.id and record_id not in 
                (select record_version.record_id from ccbc_public.record_version 
                where table_name='application_community_progress_report_data' and op = 'INSERT');
        
    end loop;

    close application_community_progress_report_records;

    return query select cnt as result_id; 
end;
$function$ language plpgsql volatile;

COMMIT;
