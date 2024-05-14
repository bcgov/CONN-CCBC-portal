-- Revert ccbc:tables/cbc_data from pg

BEGIN;

drop table if exists ccbc_public.cbc_data cascade;

COMMIT;
