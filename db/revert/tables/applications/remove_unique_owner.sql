-- Revert ccbc:tables/applications/remove_unique_owner from pg

BEGIN;

ALTER TABLE ccbc_public.applications ADD CONSTRAINT applications_owner_key UNIQUE(owner);

COMMIT;
