-- Revert ccbc:tables/application_claims_data_001 from pg

begin;

alter table ccbc_public.application_claims_data drop column history_operation;

commit;
