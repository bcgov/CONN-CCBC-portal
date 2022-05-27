-- Verify ccbc:util_functions/upsert_timestamp_columns on pg

begin;

select pg_get_functiondef('ccbc_private.upsert_timestamp_columns(text, text, boolean, boolean, boolean, text, text)'::regprocedure);

rollback;
