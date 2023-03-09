-- Deploy ccbc:import/application_analyst_lead to pg

BEGIN;

create or replace function ccbc_public.import_application_analyst_lead() returns table(result_id int)
as $function$
    declare
        current_app    ccbc_public.application_analyst_lead%ROWTYPE;
        cnt             int;
        table_oid       int;
	    application_analyst_leads    refcursor;
        pkey_cols       text[];  
        record_jsonb    jsonb; 
        record_id       uuid;  
    begin
    select count(*) into cnt from ccbc_public.application_analyst_lead;
    select oid into table_oid from  pg_class where relname='application_analyst_lead';
    pkey_cols := audit.primary_key_columns(table_oid);
    open application_analyst_leads for select *
		    from ccbc_public.application_analyst_lead;

    loop
        fetch application_analyst_leads into current_app;
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
                'application_analyst_lead',
                created_by,
                created_at,
                record_jsonb from ccbc_public.application_analyst_lead 
            where record_id not in 
                (select record_version.record_id from ccbc_public.record_version 
                where table_name='application_analyst_lead' and op = 'INSERT');
        
    end loop;

    close application_analyst_leads;

    return query select cnt as result_id; 
end;
$function$ language plpgsql volatile;

COMMIT;
