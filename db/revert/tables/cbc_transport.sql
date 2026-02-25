-- Revert ccbc:tables/cbc_transport from pg

begin;

drop table if exists ccbc_public.cbc_transport cascade;

commit;
