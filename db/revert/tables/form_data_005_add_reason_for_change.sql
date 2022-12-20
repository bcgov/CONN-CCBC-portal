-- Revert ccbc:tables/form_data_005_add_reason_for_change from pg

begin;

alter table ccbc_public.form_data drop column reason_for_change;

commit;
