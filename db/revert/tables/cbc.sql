-- Revert ccbc:tables/cbc from pg

BEGIN;

drop table if exists ccbc_public.cbc cascade;

COMMIT;
