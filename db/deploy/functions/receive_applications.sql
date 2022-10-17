-- Deploy ccbc:functions/receive_applications to pg

BEGIN;

create or replace function ccbc_public.receive_applications() returns table(result_id int)  as
$function$
	declare
        current_app    ccbc_public.application%ROWTYPE;
        last_status    text;
        cnt             int;
	    applications refcursor;

    begin
    select count(*) into cnt from ccbc_public.application
		    where intake_id in (
                select id from ccbc_public.intake where now() >= close_timestamp);

    open applications for select id, intake_id
		    from ccbc_public.application
		    where intake_id in (
                select id from ccbc_public.intake where now() >= close_timestamp);

    loop
        fetch applications into current_app;
        exit when not found;

        select ccbc_public.application_status(current_app) into last_status;

        if last_status = 'submitted' then
            insert into ccbc_public.application_status (application_id, status)
            values (current_app.id,'received');
        end if;
    end loop;

    close applications;

    return query select 0 as result_id;
    end;
$function$ language plpgsql volatile;

grant execute on function ccbc_public.receive_applications to ccbc_auth_user;

comment on function ccbc_public.receive_applications is 'Detects closed intake and marks all submitted applications as Received';

COMMIT;
