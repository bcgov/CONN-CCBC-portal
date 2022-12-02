begin;

select plan(6);
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
  'form',
  'ccbc_public.form should exist and be a table'
);

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1),
      ('2022-05-01 09:00:01-07', '2022-06-01 09:00:00-07', 2);
select mocks.set_mocked_time_in_transaction((select open_timestamp from ccbc_public.intake limit 1));

-- columns

select has_column('ccbc_public', 'form', 'id','The table application has column id');
select has_column('ccbc_public', 'form', 'slug','The table application has column slug');
select has_column('ccbc_public', 'form', 'json_schema','The table application has column json_schema');
select has_column('ccbc_public', 'form', 'description','The table application has column description');
select has_column('ccbc_public', 'form', 'form_type','The table application has column form_type');

rollback;
