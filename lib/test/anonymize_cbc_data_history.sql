BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.record_version DISABLE TRIGGER ALL;

-- Main update query for record_version
UPDATE ccbc_public.record_version
SET
  record = CASE
    WHEN record IS NOT NULL AND record ? 'json_data' THEN
      jsonb_set(record, '{json_data}', ccbc_public.anonymize_cbc_data(record->'json_data'))
    ELSE record
  END,
  old_record = CASE
    WHEN old_record IS NOT NULL AND old_record ? 'json_data' THEN
      jsonb_set(old_record, '{json_data}', ccbc_public.anonymize_cbc_data(old_record->'json_data'))
    ELSE old_record
  END
WHERE table_name = 'cbc_data';

-- Re-enable triggers
ALTER TABLE ccbc_public.record_version ENABLE TRIGGER ALL;

COMMIT;
