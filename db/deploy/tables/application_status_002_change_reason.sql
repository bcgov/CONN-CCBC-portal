-- Deploy ccbc:tables/application_status_002_change_reason to pg

begin;

  alter table ccbc_public.application_status add column change_reason varchar(1000) null;

  comment on column ccbc_public.application_status.change_reason is 'Change reason for analyst status change';

commit;
