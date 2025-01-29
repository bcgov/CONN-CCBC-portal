-- Revert ccbc:tables/application_map_data from pg

BEGIN;

drop table if exists ccbc_public.application_map_data;

COMMIT;
