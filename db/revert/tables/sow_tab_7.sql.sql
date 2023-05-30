-- Revert ccbc:tables/sow_tab_7.sql from pg

BEGIN;

drop table if exists ccbc_public.sow_tab_7;

COMMIT;
