BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.record_version DISABLE TRIGGER ALL;

-- Main update query for record_version where table_name = 'cbc_data'
UPDATE ccbc_public.record_version
SET
  record = CASE
    WHEN record IS NOT NULL AND record ? 'json_data' THEN
      jsonb_set(
        record,
        '{json_data}',
        ccbc_public.anonymize_cbc_data_numeric_fields(
          record->'json_data',
          (record->>'id')::integer,
          ARRAY[
            'bcFundingRequested',
            'federalFundingRequested',
            'applicantAmount',
            'otherFundingRequested'
          ]::text[]
        )
      )
    ELSE record
  END,
  old_record = CASE
    WHEN old_record IS NOT NULL AND old_record ? 'json_data' THEN
      jsonb_set(
        old_record,
        '{json_data}',
        ccbc_public.anonymize_cbc_data_numeric_fields(
          old_record->'json_data',
          (old_record->>'id')::integer,
          ARRAY[
            'bcFundingRequested',
            'federalFundingRequested',
            'applicantAmount',
            'otherFundingRequested'
          ]::text[]
        )
      )
    ELSE old_record
  END
WHERE table_name = 'cbc_data' AND (
  (record IS NOT NULL AND record ? 'json_data') OR
  (old_record IS NOT NULL AND old_record ? 'json_data')
);

-- Re-enable triggers
ALTER TABLE ccbc_public.record_version ENABLE TRIGGER ALL;

COMMIT;
