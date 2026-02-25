-- Revert ccbc:tables/cbc_last_mile_coverage from pg

begin;

drop table if exists ccbc_public.cbc_last_mile_coverage cascade;

commit;
