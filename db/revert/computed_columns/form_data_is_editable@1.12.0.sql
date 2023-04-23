-- Revert ccbc:computed_columns/form_data_is_editable from pg

begin;

drop function if exists ccbc_public.form_data_is_editable cascade;

commit;
