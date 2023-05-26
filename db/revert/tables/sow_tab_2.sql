-- Revert ccbc:tables/sow_tab_2 from pg

BEGIN;

drop table if exists ccbc_public.sow_tab_2;

COMMIT;
