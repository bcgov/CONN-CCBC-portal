-- Revert ccbc:tables/application_internal_notes from pg

BEGIN;

drop table if exists ccbc_public.application_internal_notes;

COMMIT;
