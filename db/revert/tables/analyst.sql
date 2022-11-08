-- Revert ccbc:tables/analyst from pg

begin;

drop table ccbc_public.analyst;

commit;
