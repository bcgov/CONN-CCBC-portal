-- Deploy ccbc:clean_application_status to pg

BEGIN;

WITH latest_rows AS (
    SELECT application_id, MAX(created_at) AS latest_created_at
    FROM ccbc_public.application_status
    WHERE archived_at IS NULL
    AND status IN ('applicant_approved', 'applicant_cancelled', 'applicant_closed', 'applicant_complete', 'applicant_conditionally_approved', 'applicant_on_hold', 'applicant_received', 'draft', 'received', 'submitted', 'withdrawn')
    GROUP BY application_id
)
UPDATE ccbc_public.application_status AS a
SET archived_at = CURRENT_TIMESTAMP
FROM latest_rows AS l
WHERE a.application_id = l.application_id
AND a.created_at <> l.latest_created_at
AND a.archived_at IS NULL
AND a.status IN ('applicant_approved', 'applicant_cancelled', 'applicant_closed', 'applicant_complete', 'applicant_conditionally_approved', 'applicant_on_hold', 'applicant_received', 'draft', 'received', 'submitted', 'withdrawn');

WITH latest_rows AS (
    SELECT application_id, MAX(created_at) AS latest_created_at
    FROM ccbc_public.application_status
    WHERE archived_at IS NULL
    AND status IN ('analyst_withdrawn', 'approved', 'assessment', 'cancelled', 'closed', 'complete', 'conditionally_approved', 'on_hold', 'recommendation', 'screening')
    GROUP BY application_id
)
UPDATE ccbc_public.application_status AS a
SET archived_at = CURRENT_TIMESTAMP
FROM latest_rows AS l
WHERE a.application_id = l.application_id
AND a.created_at <> l.latest_created_at
AND a.archived_at IS NULL
AND a.status IN ('analyst_withdrawn', 'approved', 'assessment', 'cancelled', 'closed', 'complete', 'conditionally_approved', 'on_hold', 'recommendation', 'screening');

COMMIT;
