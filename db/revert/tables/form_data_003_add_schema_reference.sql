-- Revert ccbc:tables/form_data_003_add_schema_reference from pg

begin;

alter table ccbc_public.form_data drop column form_schema_id;

commit;
