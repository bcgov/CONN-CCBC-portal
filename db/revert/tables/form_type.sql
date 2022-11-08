-- revert ccbc:tables/form_type from pg

begin;

drop table ccbc_public.form_type;

commit;
