-- Revert ccbc:tables/application_project_type from pg

BEGIN;

drop table if exists ccbc_public.application_project_type;

COMMIT;
