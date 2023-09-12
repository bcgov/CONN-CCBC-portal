-- Revert ccbc:tables/intake_007_add_hidden from pg

BEGIN;

alter table ccbc_public.intake drop column if exists hidden;

COMMIT;
