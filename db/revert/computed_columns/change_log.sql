-- Revert ccbc:computed_columns/change_log from pg

BEGIN;

drop function if exists ccbc_public.change_log;

COMMIT;
