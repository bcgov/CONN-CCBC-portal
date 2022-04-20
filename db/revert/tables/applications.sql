-- Revert ccbc:tables/applications from pg

begin;

drop table ccbc_public.applications;

commit;
