-- Revert ccbc:tables/form_data_status_type from pg

begin;

drop table ccbc_public.form_data_status_type;

commit;
