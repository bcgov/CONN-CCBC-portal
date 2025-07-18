-- Revert ccbc:cbc_001_add_old_row_id from pg

BEGIN;

ALTER TABLE ccbc_public.cbc
DROP COLUMN old_row_id;

COMMIT;
