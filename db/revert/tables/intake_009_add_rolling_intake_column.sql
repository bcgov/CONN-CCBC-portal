-- Revert ccbc:tables/intake_009_add_rolling_intake_column from pg

BEGIN;

alter table ccbc_public.intake drop column if exists rolling_intake;

COMMIT;
