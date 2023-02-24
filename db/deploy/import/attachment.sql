-- Deploy ccbc:import/attachment to pg

BEGIN;

create or replace function ccbc_public.import_attachments() returns table(result_id int)
as $function$
    declare
        current_app    ccbc_public.attachment%ROWTYPE;
        cnt             int;
        table_oid       int;
	    attachments    refcursor;
        pkey_cols       text[];  
        record_jsonb    jsonb; 
        record_id       uuid;  
    begin
    select count(*) into cnt from ccbc_public.attachment;
    select oid into table_oid from  pg_class where relname='attachment';
    pkey_cols := audit.primary_key_columns(table_oid);
    open attachments for select *
		    from ccbc_public.attachment;

    loop
        fetch attachments into current_app;
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
                'attachment',
                created_by,
                created_at,
                record_jsonb from ccbc_public.attachment 
            where record_jsonb not in 
                (select record_jsonb from ccbc_public.record_version 
                where table_name='attachment' and op = 'INSERT');
        
    end loop;

    close attachments;

    return query select cnt as result_id; 
end;
$function$ language plpgsql volatile;
grant execute on function ccbc_public.import_attachments to ccbc;
COMMIT;
