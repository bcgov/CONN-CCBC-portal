-- Revert ccbc:tables/application_claims_excel_data from pg

begin;

drop table if exists ccbc.application_claims_excel_data;

commit;
