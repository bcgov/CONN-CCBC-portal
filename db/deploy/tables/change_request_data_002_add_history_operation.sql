-- Deploy ccbc:tables/change_request_data_002_add_history_operation to pg

BEGIN;

-- Disable all triggers to allow updates, including to soft-deleted records, and no impact to date/time fields
ALTER TABLE ccbc_public.change_request_data DISABLE TRIGGER ALL;

ALTER TABLE ccbc_public.change_request_data
ADD COLUMN history_operation text;

-- Update history_operation based on application_id and created_at
WITH RankedChanges AS (
  SELECT
    id,
    application_id,
    amendment_number,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY application_id
      ORDER BY created_at ASC
    ) AS row_num
  FROM ccbc_public.change_request_data
)
UPDATE ccbc_public.change_request_data
SET history_operation = CASE
  WHEN rc.row_num = 1 THEN 'INSERT'
  ELSE 'UPDATE'
END
FROM RankedChanges rc
WHERE ccbc_public.change_request_data.id = rc.id;

-- Re-enable all triggers
ALTER TABLE ccbc_public.change_request_data ENABLE TRIGGER ALL;

COMMIT;
