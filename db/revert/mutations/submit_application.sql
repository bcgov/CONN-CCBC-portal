-- Revert ccbc:mutations/submit_application from pg

begin;

drop function ccbc_public.submit_application;

COMMIT;
