-- Deploy ccbc:functions/receive_applications to pg

BEGIN;

create or replace function ccbc_public.receive_applications() returns void as 
$function$
	declare 
        current_app    record;
        last_status    text;
	    applications cursor 
		    for select id
		    from ccbc_public.application
		    where intake_id in (
                select id from ccbc_public.intake where now() >= close_timestamp
        );
    begin
    -- open the cursor
    open applications;
        
    loop
        -- fetch row into the film
        fetch applications into current_app;
        -- exit when no more row to fetch
        exit when not found;

        select last_status = s.status from ccbc_public.application_status s inner join 
        (select max(created_at) as created_at, application_id 
            from ccbc_public.application_status group by application_id) maxdate
        on maxdate.application_id=s.application_id and maxdate.created_at=s.created_at
        where s.application_id=current_app.id;

        -- process
        if last_status = 'submitted' then     
            insert into ccbc_public.application_status (application_id, status) 
            values (current_app.id,'received');
        end if;
    end loop;
    
    -- close the cursor
    close applications;

    end; 
$function$ language plpgsql stable;

grant execute on function ccbc_public.receive_applications to ccbc_auth_user;

comment on function ccbc_public.receive_applications is 'Detects closed intake and marks all submitted applications as Received';

COMMIT;
