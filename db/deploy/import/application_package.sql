-- Deploy ccbc:import/application_package to pg

BEGIN;

create or replace function ccbc_public.import_application_packages() returns table(result_id int)
as $function$
    declare
        current_app    ccbc_public.application_package%ROWTYPE;
        cnt             int;
        table_oid       int;
	    application_packages    refcursor;
        pkey_cols       text[];  
        record_jsonb    jsonb; 
        record_id       uuid;  
    begin
    select count(*) into cnt from ccbc_public.application_package;
    select oid into table_oid from  pg_class where relname='application_package';
    pkey_cols := audit.primary_key_columns(table_oid);
    open application_packages for select *
		    from ccbc_public.application_package;

    loop
        fetch application_packages into current_app;
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
                'application_package',
                created_by,
                created_at,
                record_jsonb from ccbc_public.application_package 
            where record_id not in 
                (select record_version.record_id from ccbc_public.record_version 
                where table_name='application_package' and op = 'INSERT');
        
    end loop;

    close application_packages;

    return query select cnt as result_id; 
end;
$function$ language plpgsql volatile;

COMMIT;
