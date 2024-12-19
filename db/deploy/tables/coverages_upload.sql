-- Deploy ccbc:tables/coverages_upload to pg

begin;

create table ccbc_public.coverages_upload(
  id integer primary key generated always as identity,
  uuid text not null);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'coverages_upload');
select audit.enable_tracking('ccbc_public.coverages_upload'::regclass);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'coverages_upload', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'coverages_upload', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'coverages_upload', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'coverages_upload', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'coverages_upload', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'coverages_upload', 'ccbc_admin');
perform ccbc_private.grant_permissions('select', 'coverages_upload', 'cbc_admin');
perform ccbc_private.grant_permissions('insert', 'coverages_upload', 'cbc_admin');
perform ccbc_private.grant_permissions('update', 'coverages_upload', 'cbc_admin');

end
$grant$;

comment on table ccbc_public.coverages_upload is 'Table to store coverages upload files uuids';

comment on column ccbc_public.coverages_upload.id is 'Unique id for the row';

comment on column ccbc_public.coverages_upload.uuid is 'The uuid of the file uploaded to s3';

commit;
