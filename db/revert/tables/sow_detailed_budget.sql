-- Revert ccbc:tables/sow_detailed_budget from pg

BEGIN;

drop table if exists ccbc_public.sow_detailed_budget;

COMMIT;
