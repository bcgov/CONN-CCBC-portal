-- Revert ccbc:tables/conditional_approval_data from pg

begin;

drop table ccbc_public.conditional_approval_data;

commit;
