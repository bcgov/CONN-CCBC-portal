-- Revert ccbc:tables/application_claims_data from pg

begin;

drop table if exists ccbc_public.application_claims_data cascade;

commit;
