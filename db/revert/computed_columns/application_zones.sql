-- Revert ccbc:computed_columns/application_zones from pg

BEGIN;

drop function if exists ccbc_public.application_zones;

COMMIT;
