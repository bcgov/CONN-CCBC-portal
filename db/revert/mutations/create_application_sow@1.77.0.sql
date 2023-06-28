-- Revert ccbc:mutations/create_application_sow_data from pg

BEGIN;

drop function ccbc_public.create_application_sow;

COMMIT;
