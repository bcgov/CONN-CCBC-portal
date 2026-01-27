-- Revert ccbc:tables/intake_011_add_allow_unlisted_fn_led_zones_column from pg
BEGIN;

alter table ccbc_public.intake
  drop column if exists allow_unlisted_fn_led_zones;

COMMIT;
