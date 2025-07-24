BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.rfi_data DISABLE TRIGGER ALL;

-- Main update query for rfi_data
UPDATE ccbc_public.rfi_data
SET json_data = ccbc_public.anonymize_filenames(json_data)
WHERE json_data IS NOT NULL AND (
  json_data ? 'rfiAdditionalFiles' OR
  json_data ? 'rfiEmailCorrespondance'
);

-- Re-enable triggers
ALTER TABLE ccbc_public.rfi_data ENABLE TRIGGER ALL;

COMMIT;
