-- Deploy ccbc:tables/attachment to pg
-- requires: tables/application_status
-- requires: tables/applications

begin;

create table ccbc_public.attachment
(
  id integer primary key generated always as identity,
  file uuid,
  description varchar(10000),
  file_name varchar(1000),
  file_type varchar(100),
  file_size varchar(100),
  application_id integer not null references ccbc_public.applications(id),
  application_status_id integer references ccbc_public.application_status(id)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'attachment');

create unique index attachment_file on ccbc_public.attachment(file);

do
$grant$
begin

-- Grant ccbc_auth_user permissions
perform ccbc_private.grant_permissions('select', 'attachment', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('insert', 'attachment', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('update', 'attachment', 'ccbc_auth_user');

end
$grant$;

-- Enable row-level security
alter table ccbc_public.attachment force row level security;
alter table ccbc_public.attachment enable row level security;

do
$policy$
begin
-- ccbc_auth_user RLS: can see and modify only its own records
perform ccbc_private.upsert_policy('ccbc_auth_user_select_attachment', 'attachment', 'select', 'ccbc_auth_user', 'application_id in (select id from ccbc_public.applications where owner=(select sub from ccbc_public.session()))');
perform ccbc_private.upsert_policy('ccbc_auth_user_insert_attachment', 'attachment', 'insert', 'ccbc_auth_user', 'application_id in (select id from ccbc_public.applications where owner=(select sub from ccbc_public.session()))');
perform ccbc_private.upsert_policy('ccbc_auth_user_update_attachment', 'attachment', 'update', 'ccbc_auth_user', 'application_id in (select id from ccbc_public.applications where owner=(select sub from ccbc_public.session()))');

end
$policy$;

comment on table ccbc_public.attachment is 'Table containing information about uploaded attachments';
comment on column ccbc_public.attachment.id is 'Unique ID for the attachment';
comment on column ccbc_public.attachment.file is 'Universally Unique ID for the attachment, created by the fastapi storage micro-service';
comment on column ccbc_public.attachment.description is 'Description of the attachment';
comment on column ccbc_public.attachment.file_name is 'Original uploaded file name';
comment on column ccbc_public.attachment.file_type is 'Original uploaded file type';
comment on column ccbc_public.attachment.file_size is 'Original uploaded file size';
comment on column ccbc_public.attachment.application_id is 'The id of the project (ccbc_public.application.id) that the attachment was uploaded to';
comment on column ccbc_public.attachment.application_status_id is 'The id of the application_status (ccbc_public.application_status.id) that the attachment references';

commit;
