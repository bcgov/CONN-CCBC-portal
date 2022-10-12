-- Revert ccbc:tables/application_form_data from pg

begin;

drop table ccbc_public.application_form_data;

commit;
