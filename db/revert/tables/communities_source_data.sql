-- Revert ccbc:tables/communities_source_data from pg

BEGIN;

drop table if exists ccbc_public.communities_source_data;

COMMIT;
