-- Revert ccbc:tables/applications/connect_intake_table from pg

BEGIN;

ALTER TABLE ccbc_public.application DROP COLUMN intake_id;

COMMIT;
