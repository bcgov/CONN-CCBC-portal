-- Deploy ccbc:tables/coverages_upload_001_add_file_name to pg

BEGIN;

alter table ccbc_public.coverages_upload add column file_name varchar(1000);

comment on column ccbc_public.coverages_upload.file_name is 'The original file name of the uploaded coverage file';

COMMIT;
