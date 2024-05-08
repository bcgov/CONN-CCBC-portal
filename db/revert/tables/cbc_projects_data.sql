-- Revert ccbc:tables/cbc_projects_data from pg

BEGIN;

drop table if exists ccbc_public.cbc_projects_data cascade;

COMMIT;
