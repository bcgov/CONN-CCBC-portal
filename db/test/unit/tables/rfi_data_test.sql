begin;

select plan(5);
truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.application_analyst_lead,
  ccbc_public.application_rfi_data,
  ccbc_public.rfi_data
restart identity cascade;

select has_table(
  'ccbc_public',
  'rfi_data',
  'ccbc_public.rfi_data should exist and be a table'
);

-- columns

select has_column('ccbc_public', 'rfi_data', 'id','The table rfi_data has column id');
select has_column('ccbc_public', 'rfi_data', 'rfi_number','The table rfi_data has column rfi_number');
select has_column('ccbc_public', 'rfi_data', 'json_data','The table rfi_data has column json_scjson_datahema');
select has_column('ccbc_public', 'rfi_data', 'rfi_data_status_type_id','The table rfi_data has column rfi_data_status_type_id');

rollback;
