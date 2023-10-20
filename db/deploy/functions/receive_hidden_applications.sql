-- Deploy ccbc:functions/receive_hidden_applications to pg

begin;


create or replace function ccbc_public.receive_hidden_applications() returns table(result_id int)  as
$function$
	declare
        current_app    ccbc_public.application%ROWTYPE;
        last_status    text;
        cnt             int;
	    applications refcursor;

    begin
    select count(*) into cnt from ccbc_public.application
		    where intake_id in (
                select id from ccbc_public.intake where hidden = 't' and archived_at is null);

    open applications for select id, intake_id
		    from ccbc_public.application
		    where intake_id in (
                select id from ccbc_public.intake where hidden = 't' and archived_at is null);

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

grant execute on function ccbc_public.receive_hidden_applications to ccbc_job_executor;

comment on function ccbc_public.receive_hidden_applications is 'Detects any applications in a hidden intake and marks them as received';

commit;
