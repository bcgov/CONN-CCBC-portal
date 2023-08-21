-- Revert ccbc:mutations/create_application_claims_data from pg

begin;

drop function if exists ccbc_public.application_claims_data;

commit;
