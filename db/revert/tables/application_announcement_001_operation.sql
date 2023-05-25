-- Revert ccbc:tables/application_announcement_001_operation from pg

begin;

alter table ccbc_public.application_announcement drop column history_operation;

commit;
