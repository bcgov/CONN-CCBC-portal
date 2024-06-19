-- Revert ccbc:tables/cbc_project_communities from pg

BEGIN;

drop table if exists ccbc_public.cbc_project_communities;

COMMIT;
