-- Revert ccbc:tables/coverages_upload from pg

BEGIN;

drop table ccbc_public.coverages_upload;

COMMIT;
