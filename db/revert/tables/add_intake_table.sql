-- Revert ccbc:tables/add_intake_table from pg

BEGIN;

drop table ccbc_public.intake;

COMMIT;
