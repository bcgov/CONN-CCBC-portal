-- Deploy ccbc:functions/add_ccbc_id to pg

BEGIN;

CREATE FUNCTION ccbc_public.applications_add_ccbc_id(application_id integer) RETURNS ccbc_public.applications as $$
DECLARE 
    latest_reference_number integer;
    current_intake_fk integer;
    application ccbc_public.applications;
    _ccbc_intake_number integer;
    current_timestamp timestamp with time zone:= CURRENT_TIMESTAMP;
BEGIN
    SELECT * into application from ccbc_public.applications where id = application_id;

    IF application is null THEN 
        RAISE 'This application does not exist';
    END IF;

    IF application.intake_id is not null THEN 
        RETURN application;
    END IF;
    
    select id, ccbc_intake_number into current_intake_fk,  _ccbc_intake_number from ccbc_public.intake where current_timestamp >= open_timestamp  AND current_timestamp <= close_timestamp;


    IF current_intake_fk is null THEN
        -- [VB] use hardcoded intake number for now and backfill intake table
        INSERT INTO ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number) 
        VALUES ('2022-09-07 00:00:00','2022-11-06 23:59:59', 1);

        current_intake_fk := 1;
        _ccbc_intake_number := 1;
    END IF;

    IF current_intake_fk is null THEN
        RAISE 'There are no available intakes';
    END IF;

    -- Commented it out because the ccbc_auth_user does not have LOCK permissiosn for the applications table. 
    -- Is there some consideration around preventing this or should this be added?
    -- lock to ensure that no other references are added, does not prevent from reading in SHARE mode
    -- LOCK ccbc_public.applications IN SHARE MODE;
    select reference_number into latest_reference_number from ccbc_public.applications
         where reference_number is not null AND intake_id = current_intake_fk ORDER BY reference_number DESC;

    IF latest_reference_number is null THEN
        latest_reference_number := 0;
    END IF;

    latest_reference_number:= latest_reference_number + 1;

    UPDATE ccbc_public.applications SET reference_number = latest_reference_number WHERE id=application_id;
    UPDATE ccbc_public.applications SET intake_id = current_intake_fk WHERE id=application_id;
    UPDATE ccbc_public.applications SET status = 'submitted' WHERE id=application_id;
    -- update local variable for return
    application.status := 'submitted';
    application.reference_number := latest_reference_number;
    application.intake_id := current_intake_fk;
    RETURN application;
    

END
$$ LANGUAGE 'plpgsql' VOLATILE SECURITY INVOKER;

grant execute on function ccbc_public.applications_add_ccbc_id to ccbc_auth_user;

comment on function ccbc_public.applications_add_ccbc_id is 'Function to update an application with a CCBC-ID';

COMMIT;
