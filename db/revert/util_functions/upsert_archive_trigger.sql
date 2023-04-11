-- Revert ccbc:util_functions/upsert_archive_trigger from pg

BEGIN;

drop function upsert_archive_trigger(text, text, text, text);

COMMIT;
