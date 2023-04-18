-- Revert ccbc:util_functions/upsert_archive_trigger from pg

BEGIN;

drop function if exists upsert_archive_trigger(text, text);

COMMIT;
