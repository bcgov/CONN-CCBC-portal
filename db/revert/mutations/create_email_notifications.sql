-- Revert ccbc:mutations/create_email_notification from pg

BEGIN;

drop function ccbc_public.create_email_notifications;

COMMIT;
