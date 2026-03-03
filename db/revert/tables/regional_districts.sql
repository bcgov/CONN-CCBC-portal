-- Revert ccbc:tables/regional_districts from pg

begin;

drop table if exists ccbc_public.regional_districts;

commit;
