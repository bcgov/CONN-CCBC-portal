BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.conditional_approval_data DISABLE TRIGGER ALL;

-- Anonymize numeric fields in conditional_approval_data table
UPDATE ccbc_public.conditional_approval_data
SET json_data = ccbc_public.anonymize_conditional_approval_data_numeric_fields(
  json_data,
  id,
  ARRAY[
    'decision,provincialRequested',
    'isedDecisionObj,federalRequested'
  ]::text[]
)
WHERE json_data IS NOT NULL;

-- Re-enable triggers
ALTER TABLE ccbc_public.conditional_approval_data ENABLE TRIGGER ALL;

COMMIT;
