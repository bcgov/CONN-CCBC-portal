BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.application_internal_description DISABLE TRIGGER ALL;

-- Anonymize description field in application_internal_description table
UPDATE ccbc_public.application_internal_description
SET description = ccbc_public.generate_lorem_ipsum(description)
WHERE description IS NOT NULL;

-- Re-enable triggers
ALTER TABLE ccbc_public.application_internal_description ENABLE TRIGGER ALL;

COMMIT;
