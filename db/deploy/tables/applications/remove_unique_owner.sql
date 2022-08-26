-- Deploy ccbc:tables/applications/remove_unique_owner to pg

BEGIN;

ALTER TABLE ccbc_public.application DROP CONSTRAINT application_owner_key;

COMMIT;
