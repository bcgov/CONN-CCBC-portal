-- Revert ccbc:computed_columns/application_zone from pg

BEGIN;

drop function ccbc_public.application_zone;

COMMIT;
