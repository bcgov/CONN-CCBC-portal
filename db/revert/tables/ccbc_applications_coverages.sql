-- Revert ccbc:tables/ccbc_applications_coverages from pg

begin;

drop table if exists ccbc_public.ccbc_applications_coverages;

commit;
