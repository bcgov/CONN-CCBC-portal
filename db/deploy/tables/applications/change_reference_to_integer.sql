-- Deploy ccbc:tables/applications/change_to_ccbc_number to pg

BEGIN;

-- Note: I don't know if this is the best way to do this, since this will most likely fail in production if we've got text in there already
ALTER TABLE ccbc_public.applications ALTER COLUMN reference_number TYPE integer USING reference_number::integer ;

COMMIT;
