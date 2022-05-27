-- Revert ccbc:tables/ccbc_user from pg

begin;

drop table ccbc_public.ccbc_user;

commit;
