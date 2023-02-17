-- Revert ccbc:tables/gapless_counter from pg

begin;

drop table ccbc_public.gapless_counter;

commit;
