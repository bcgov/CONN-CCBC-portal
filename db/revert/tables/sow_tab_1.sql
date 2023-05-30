-- Revert ccbc:tables/sow_tab_1 from pg

BEGIN;

drop table if exists ccbc_public.sow_tab_1;

COMMIT;
