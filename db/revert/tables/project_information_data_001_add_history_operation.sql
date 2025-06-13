-- Revert ccbc:tables/project_information_data_001_add_history_operation from pg

BEGIN;

ALTER TABLE ccbc_public.project_information_data
DROP COLUMN history_operation;

COMMIT;
