-- Deploy ccbc:import/import_once to pg

BEGIN;

drop function ccbc_public.import_once();

COMMIT;
