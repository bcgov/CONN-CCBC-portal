-- Revert ccbc:tables/form_data from pg

begin;

drop table ccbc_public.form_data;

commit;
