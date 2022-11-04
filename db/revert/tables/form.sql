-- revert ccbc:tables/form from pg

begin;

drop table ccbc_public.form;

commit;
