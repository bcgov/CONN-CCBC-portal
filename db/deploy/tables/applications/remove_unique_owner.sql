-- Deploy ccbc:tables/applications/remove_unique_owner to pg

BEGIN;

ALTER TABLE ccbc_public.applications DROP CONSTRAINT IF EXISTS applications_owner_key;

COMMIT;
