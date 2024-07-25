-- Revert ccbc:computed_columns/application_announced from pg

BEGIN;

drop function ccbc_public.application_announced;

COMMIT;
