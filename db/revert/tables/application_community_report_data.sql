-- Revert ccbc:tables/application_community_report_data from pg

begin;

drop table ccbc_public.application_community_report_data cascade;

commit;
