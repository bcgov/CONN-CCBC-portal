-- Deploy ccbc:mutations/archive_application_change_request to pg

BEGIN;

CREATE OR REPLACE FUNCTION ccbc_public.archive_application_change_request(
    p_application_id INTEGER,
    p_amendment_number INTEGER,
    p_history_operation TEXT
) RETURNS VOID AS $$
BEGIN
    -- Update archived_at and history_operation in change_request_data table for matching records
    UPDATE ccbc_public.change_request_data
    SET archived_at = NOW(), history_operation = p_history_operation
    WHERE application_id = p_application_id
    AND amendment_number = p_amendment_number
    AND archived_at IS NULL;

    -- Update archived_at and history_operation in application_sow_data table for matching records
    UPDATE ccbc_public.application_sow_data
    SET archived_at = NOW(), history_operation = p_history_operation
    WHERE application_id = p_application_id
    AND amendment_number = p_amendment_number
    AND archived_at IS NULL;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ccbc_public.archive_application_change_request to ccbc_analyst;
GRANT EXECUTE ON FUNCTION ccbc_public.archive_application_change_request to ccbc_admin;

COMMIT;
