-- Revert ccbc:tables/application_status_002_change_reason from pg

begin;

alter table ccbc_public.application_status drop column change_reason;

commit;
