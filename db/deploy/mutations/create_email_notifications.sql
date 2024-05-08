-- Deploy ccbc:mutations/create_email_notifications to pg

CREATE OR REPLACE FUNCTION ccbc_public.create_email_notifications(
    email_records jsonb[]
)
RETURNS SETOF ccbc_public.notification
AS $$
DECLARE
    email_input JSONB;
    notification_input JSONB;
    new_email_record_id INT;
    new_notification ccbc_public.notification%ROWTYPE;
BEGIN
    -- Loop through the input JSON array
    FOR email_input IN SELECT * FROM unnest(email_records) AS email_loop LOOP
        -- Insert into email_record
        INSERT INTO ccbc_public.email_record (to_email, cc_email, subject, body, message_id, json_data)
        VALUES (
            email_input->>'toEmail',
            email_input->>'ccEmail',
            email_input->>'subject',
            email_input->>'body',
            email_input->>'messageId',
            email_input->'jsonData'
        )
        RETURNING id INTO new_email_record_id;

        -- Unpack the 'notifications' JSON array
        FOR notification_input IN
            SELECT jsonb_array_elements(email_input->'notifications')
            AS json_element LOOP

            -- Insert into the notification table
            INSERT INTO ccbc_public.notification (notification_type, application_id, json_data, email_record_id)
            VALUES (
                notification_input->>'notificationType',
                (notification_input->>'applicationId')::int,
                notification_input->'jsonData',
				new_email_record_id
            )
            RETURNING * INTO new_notification;

            RETURN NEXT new_notification; -- Return the created notification
        END LOOP;
    END LOOP;

    RETURN;
END;
$$ LANGUAGE plpgsql VOLATILE;

GRANT EXECUTE ON FUNCTION ccbc_public.create_email_notifications TO ccbc_analyst;
GRANT EXECUTE ON FUNCTION ccbc_public.create_email_notifications TO ccbc_admin;

COMMIT;
