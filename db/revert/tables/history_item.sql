-- Revert ccbc:types/history_item from pg

BEGIN;

drop type ccbc_public.history_item;

COMMIT;
