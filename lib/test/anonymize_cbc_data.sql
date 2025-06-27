BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.cbc_data DISABLE TRIGGER ALL;

-- Main update query
UPDATE ccbc_public.cbc_data
SET json_data = ccbc_public.anonymize_cbc_data(json_data)
WHERE json_data IS NOT NULL;

-- Re-enable triggers
ALTER TABLE ccbc_public.cbc_data ENABLE TRIGGER ALL;

COMMIT;
