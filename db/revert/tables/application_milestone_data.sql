-- Revert ccbc:tables/application_milestone_data from pg

begin;

drop table if exists ccbc_public.application_milestone_data cascade;

commit;
