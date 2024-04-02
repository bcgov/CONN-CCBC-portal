-- Revert ccbc:tables/analyst_add_email from pg

BEGIN;

alter table ccbc_public.analyst drop column email;

COMMIT;
