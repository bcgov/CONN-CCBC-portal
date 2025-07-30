BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.record_version DISABLE TRIGGER ALL;

-- Main update query for record_version where table_name = 'application_internal_description'
UPDATE ccbc_public.record_version
SET
  record = CASE
    WHEN record IS NOT NULL AND record ? 'description' THEN
      jsonb_set(
        record,
        '{description}',
        to_jsonb(ccbc_public.generate_lorem_ipsum(record->>'description')),
        false
      )
    ELSE record
  END,
  old_record = CASE
    WHEN old_record IS NOT NULL AND old_record ? 'description' THEN
      jsonb_set(
        old_record,
        '{description}',
        to_jsonb(ccbc_public.generate_lorem_ipsum(old_record->>'description')),
        false
      )
    ELSE old_record
  END
WHERE table_name = 'application_internal_description' AND (
  (record IS NOT NULL AND record ? 'description') OR
  (old_record IS NOT NULL AND old_record ? 'description')
);

-- Re-enable triggers
ALTER TABLE ccbc_public.record_version ENABLE TRIGGER ALL;

COMMIT;
