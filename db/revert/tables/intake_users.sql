-- Revert ccbc:tables/intake_users from pg

BEGIN;

drop table if exists ccbc_public.intake_users;

COMMIT;
