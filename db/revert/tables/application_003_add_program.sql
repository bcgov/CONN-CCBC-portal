-- Revert ccbc:tables/application_003_add_program from pg

BEGIN;

alter table ccbc_public.application drop column if exists program;

COMMIT;
