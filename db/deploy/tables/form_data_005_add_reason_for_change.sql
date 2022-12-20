-- Deploy ccbc:tables/form_data_005_add_reason_for_change to pg

begin;

  alter table ccbc_public.form_data add column reason_for_change varchar(1000);

  comment on column ccbc_public.form_data.reason_for_change is 'Column to track analysts reason for changing form data';

commit;
