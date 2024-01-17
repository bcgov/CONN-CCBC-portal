-- Revert ccbc:mutations/create_project_type from pg

BEGIN;

drop function if exists ccbc_public.create_project_type;

COMMIT;
