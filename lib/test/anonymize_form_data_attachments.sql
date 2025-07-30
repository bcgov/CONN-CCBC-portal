BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.form_data DISABLE TRIGGER ALL;

-- Main update query for form_data
UPDATE ccbc_public.form_data
SET json_data = ccbc_public.anonymize_filenames(json_data)
WHERE json_data IS NOT NULL AND (
  json_data ? 'coverage' OR
  json_data ? 'templateUploads' OR
  json_data ? 'supportingDocuments'
);

-- Re-enable triggers
ALTER TABLE ccbc_public.form_data ENABLE TRIGGER ALL;

COMMIT;
