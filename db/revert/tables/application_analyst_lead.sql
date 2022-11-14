-- Revert ccbc:tables/application_analyst_lead from pg

begin;

drop table ccbc_public.application_analyst_lead;

commit;
