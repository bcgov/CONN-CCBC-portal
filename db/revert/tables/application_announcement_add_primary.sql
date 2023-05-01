-- Revert ccbc:tables/application_announcement_add_primary from pg

BEGIN;

alter table ccbc_public.application_status drop column if exists is_primary;

COMMIT;
