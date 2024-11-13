-- Revert ccbc:tables/history_item_002_add_created_by from pg

BEGIN;

alter table ccbc_public.history_item drop column if exists created_by;

COMMIT;
