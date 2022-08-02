-- Revert ccbc:tables/applications/change_to_ccbc_number from pg

BEGIN;

-- This won't lose any data, but if we ever add anything in that isn't a number this will raise an error
ALTER TABLE ccbc_public.applications ALTER COLUMN reference_number TYPE VARCHAR(1000);

COMMIT;
