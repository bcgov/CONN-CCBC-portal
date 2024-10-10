-- Revert ccbc:tables/application_form_template_9_data from pg

BEGIN;

drop table if exists ccbc_public.application_form_template_9_data;

COMMIT;
