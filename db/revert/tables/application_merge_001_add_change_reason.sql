-- Revert ccbc:tables/application_merge_001_add_change_reason from pg
begin;

alter table ccbc_public.application_merge
drop column if exists change_reason;

commit;
