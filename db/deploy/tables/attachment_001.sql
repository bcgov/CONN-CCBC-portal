-- Deploy ccbc:tables/attachment_001 to pg
-- requires: tables/attachment

begin;

alter table ccbc_public.attachment add column is_deleted boolean not null default false;
alter table ccbc_public.attachment add column deleted_by int references ccbc_public.ccbc_user;
alter table ccbc_public.attachment add column deleted_at TIMESTAMP;

comment on column ccbc_public.attachment.is_deleted is 'Boolean declaring if the file has been soft deleted';
comment on column ccbc_public.attachment.deleted_by is 'The id of the user that deleted the file';
comment on column ccbc_public.attachment.deleted_at is 'The time the file was deleted at';

commit;
