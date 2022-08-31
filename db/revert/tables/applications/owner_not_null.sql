-- Revert ccbc:tables/applications/owner_not_null from pg

BEGIN;

ALTER TABLE ccbc_public.application ALTER COLUMN owner DROP NOT NULL;

COMMIT;
