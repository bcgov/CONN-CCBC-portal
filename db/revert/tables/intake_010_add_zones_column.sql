-- Revert ccbc:tables/intake_010_add_zones_column from pg
BEGIN;

alter table ccbc_public.intake
drop column if exists zones;

COMMIT;
