-- Deploy ccbc:tables/application_sow_data_003_add_history_operation to pg

BEGIN;

-- Disable all triggers to allow updates, including to soft-deleted records, and no impact to date/time fields
ALTER TABLE ccbc_public.application_sow_data DISABLE TRIGGER ALL;

ALTER TABLE ccbc_public.application_sow_data
ADD COLUMN history_operation text;

-- Update history_operation based on application_id and created_at
WITH RankedSows AS (
  SELECT
    id,
    application_id,
    amendment_number,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY application_id
      ORDER BY created_at ASC
    ) AS row_num
  FROM ccbc_public.application_sow_data
)
UPDATE ccbc_public.application_sow_data
SET history_operation = CASE
  WHEN rs.row_num = 1 THEN 'INSERT'
  ELSE 'UPDATE'
END
FROM RankedSows rs
WHERE ccbc_public.application_sow_data.id = rs.id;

-- Re-enable all triggers
ALTER TABLE ccbc_public.application_sow_data ENABLE TRIGGER ALL;

COMMIT;
