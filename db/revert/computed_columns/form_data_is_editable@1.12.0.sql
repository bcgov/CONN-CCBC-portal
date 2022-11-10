-- Revert ccbc:computed_columns/form_data_is_editable from pg

begin;

drop function ccbc_public.form_data_is_editable;

commit;
