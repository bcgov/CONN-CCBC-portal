-- Deploy ccbc:tables/applications/owner_not_null to pg

BEGIN;

ALTER TABLE ccbc_public.applications ALTER COLUMN owner SET NOT NULL;

COMMIT;
