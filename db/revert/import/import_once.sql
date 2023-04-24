-- Deploy ccbc:import/import_once to pg

BEGIN;

drop function if exists ccbc_public.import_once();

COMMIT;
