-- Deploy ccbc:cbc_001_add_old_row_id to pg

BEGIN;

ALTER TABLE ccbc_public.cbc
ADD COLUMN old_row_id INTEGER
    REFERENCES ccbc_public.cbc(id)
    ON DELETE SET NULL;

COMMIT;
