-- Revert ccbc:tables/sow_tab_8 from pg

BEGIN;

drop table if exists ccbc_public.sow_tab_8;

COMMIT;
