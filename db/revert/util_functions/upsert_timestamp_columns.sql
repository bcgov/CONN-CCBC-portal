-- Revert ccbc:util_functions/upsert_timestamp_columns from pg

begin;

drop function if exists ccbc_private.upsert_timestamp_columns(text, text, boolean, boolean, boolean, text, text); 

commit;
