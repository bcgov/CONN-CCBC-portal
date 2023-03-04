-- Revert ccbc:computed_columns/application_history from pg

BEGIN;

drop function ccbc_public.application_history(ccbc_public.application);

COMMIT;
