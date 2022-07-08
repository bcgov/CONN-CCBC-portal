-- Revert ccbc:tables/attachment from pg

BEGIN;

drop table ccbc_public.attachment;

COMMIT;
