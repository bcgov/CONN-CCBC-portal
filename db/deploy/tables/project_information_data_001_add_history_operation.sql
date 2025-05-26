-- Deploy ccbc:tables/project_information_data_001_add_history_operation to pg

BEGIN;

-- Disable all triggers to allow updates, including to soft-deleted records, and no impact to date/time fields
ALTER TABLE ccbc_public.project_information_data DISABLE TRIGGER ALL;

ALTER TABLE ccbc_public.project_information_data
ADD COLUMN history_operation text;

-- Update history_operation based on application_id and created_at
WITH RankedProjects AS (
  SELECT
    id,
    application_id,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY application_id
      ORDER BY created_at ASC
    ) AS row_num
  FROM ccbc_public.project_information_data
)
UPDATE ccbc_public.project_information_data
SET history_operation = CASE
  WHEN rp.row_num = 1 THEN 'INSERT'
  ELSE 'UPDATE'
END
FROM RankedProjects rp
WHERE ccbc_public.project_information_data.id = rp.id;

-- Re-enable all triggers
ALTER TABLE ccbc_public.project_information_data ENABLE TRIGGER ALL;

COMMIT;
