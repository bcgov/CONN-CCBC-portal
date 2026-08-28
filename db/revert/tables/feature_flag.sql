-- Revert ccbc:tables/feature_flag from pg

BEGIN;

drop table if exists ccbc_public.feature_flag;

COMMIT;
