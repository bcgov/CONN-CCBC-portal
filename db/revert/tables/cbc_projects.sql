-- Revert ccbc:tables/cbc_projects from pg

BEGIN;

drop table if exists ccbc_public.cbc_projects cascade;

COMMIT;
