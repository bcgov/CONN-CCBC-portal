-- Revert ccbc:tables/application_sow_data_003_add_history_operation from pg

BEGIN;

ALTER TABLE ccbc_public.application_sow_data
DROP COLUMN history_operation;

COMMIT;
