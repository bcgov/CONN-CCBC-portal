-- Revert ccbc:tables/application_fnha_contribution from pg

begin;

drop table if exists ccbc_public.application_fnha_contribution;

commit;
