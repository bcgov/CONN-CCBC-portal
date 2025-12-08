-- Deploy ccbc:tables/application_merge_001_add_change_reason to pg

begin;

alter table ccbc_public.application_merge
  add column change_reason text default null;

comment on column ccbc_public.application_merge.change_reason is 'Reason provided when creating or archiving a merge';

commit;
