-- Revert ccbc:clean_application_status from pg

BEGIN;

-- No real revert due to ccbc_private.archived_records_are_immutable (Deleted records cannot be modified)

COMMIT;
