-- Revert ccbc:mutations/create_application_claims_excel_data from pg

begin;

drop function if exists ccbc_public.create_application_claims_excel_data cascade;

commit;
