BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.cbc_data DISABLE TRIGGER ALL;

-- Anonymize numeric fields in cbc_data table
UPDATE ccbc_public.cbc_data
SET json_data = ccbc_public.anonymize_cbc_data_numeric_fields(
  json_data,
  id,
  ARRAY[
    'bcFundingRequested',
    'federalFundingRequested',
    'applicantAmount',
    'otherFundingRequested'
  ]::text[]
)
WHERE json_data IS NOT NULL;

-- Re-enable triggers
ALTER TABLE ccbc_public.cbc_data ENABLE TRIGGER ALL;

COMMIT;
