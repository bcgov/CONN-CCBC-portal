-- Revert ccbc:tables/form_data from pg

begin;

drop table if exists ccbc_public.form_data cascade;

commit;
