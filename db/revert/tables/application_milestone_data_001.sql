-- Revert ccbc:tables/application_milestone_data_001 from pg

begin;

alter table ccbc_public.application_milestone_data drop column history_operation;

commit;
