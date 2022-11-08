-- deploy ccbc:tables/form_data_003_add_schema_reference to pg

begin;

  alter table ccbc_public.form_data add column form_schema_id int references ccbc_public.form(id) default 1;

  alter table ccbc_public.form_data alter column form_schema_id drop default;

  comment on column ccbc_public.form_data.form_schema_id is 'Schema for the respective form_data';

commit;
