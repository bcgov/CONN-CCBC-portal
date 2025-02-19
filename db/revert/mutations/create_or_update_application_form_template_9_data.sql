-- Revert ccbc:mutations/create_or_update_application_form_template_9_data from pg

BEGIN;

drop function ccbc_public.create_or_update_application_form_template_9_data(int, jsonb, jsonb, jsonb, int);

COMMIT;
