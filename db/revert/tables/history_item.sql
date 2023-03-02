-- Revert ccbc:types/history_item from pg

BEGIN;

drop table ccbc_public.history_item;

COMMIT;
