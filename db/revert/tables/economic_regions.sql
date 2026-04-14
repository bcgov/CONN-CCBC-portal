-- Revert ccbc:tables/economic_regions from pg

begin;

drop table if exists ccbc_public.economic_regions;

commit;
