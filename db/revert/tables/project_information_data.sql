-- Revert ccbc:tables/project_information_data from pg

begin;

drop table ccbc_public.project_information_data;

commit;
