-- Revert ccbc:tables/change_request_data_002_add_history_operation from pg

BEGIN;

ALTER TABLE ccbc_public.change_request_data
DROP COLUMN history_operation;

COMMIT;
