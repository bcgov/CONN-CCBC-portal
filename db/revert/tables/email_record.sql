-- Revert ccbc:tables/email_record from pg

BEGIN;

drop table ccbc_public.email_record;

COMMIT;
