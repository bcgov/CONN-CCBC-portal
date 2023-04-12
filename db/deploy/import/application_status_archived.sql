BEGIN;

CREATE OR REPLACE FUNCTION ccbc_public.set_application_status_archived() returns table(result_id int)
as $function$
    declare
        current_app    ccbc_public.application_status%ROWTYPE;
        cnt             int; 
	    application_statuses    refcursor;
    begin
	ALTER TABLE ccbc_public.application_status DISABLE TRIGGER _100_timestamps;

    select count(*) into cnt from ccbc_public.application_status;

    open application_statuses for select *
		    from ccbc_public.application_status where archived_at is null;

    loop
        fetch application_statuses into current_app;
        exit when not found; 

        update ccbc_public.application_status 
			set archived_at = r.created_at, archived_by = r.created_by
		from ccbc_public.application_status as app 
        inner join 
		(select record, created_at, created_by from ccbc_public.record_version 
		 where table_name='application_status' and op='INSERT' 
            and (record->>'application_id')::int = current_app.application_id
		    and (record->>'id')::int > current_app.id order by (record->>'id')::int limit 1
		) as r 
        on (r.record->>'application_id')::int = app.application_id
        where app.id = current_app.id
			and ccbc_public.application_status.id = current_app.id 
			and ccbc_public.application_status.archived_at is null 
			and app.id not in (select max(id) as lastid 
        	from ccbc_public.application_status group by application_id);

        
    end loop;

    close application_statuses;

	ALTER TABLE ccbc_public.application_status ENABLE TRIGGER _100_timestamps;
    return query select cnt as result_id; 
    end;
$function$ language plpgsql volatile;

ALTER FUNCTION ccbc_public.set_application_status_archived()
    OWNER TO postgres;

COMMENT ON FUNCTION ccbc_public.set_application_status_archived()
    IS 'populates archived columns for existing application_status records';

COMMIT;
