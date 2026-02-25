-- Revert ccbc:tables/coverages_upload_001_add_file_name from pg

BEGIN;

alter table ccbc_public.coverages_upload drop column if exists file_name;

COMMIT;
