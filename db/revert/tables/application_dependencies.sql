-- Revert ccbc:tables/application_dependencies from pg

BEGIN;

drop table if exists ccbc_public.application_dependencies;

COMMIT;
