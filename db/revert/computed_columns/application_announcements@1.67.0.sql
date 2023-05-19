-- Revert ccbc:computed_columns/application_announcements from pg

BEGIN;

drop function ccbc_public.application_announcements;

COMMIT;
