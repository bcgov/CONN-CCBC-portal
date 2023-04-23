-- Revert ccbc:tables/application_form_data from pg

begin;

drop table if exists ccbc_public.application_form_data cascade;

commit;
