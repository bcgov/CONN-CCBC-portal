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


insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1),
      ('2022-05-01 09:00:01-07', '2022-06-01 09:00:00-07', 2);
select mocks.set_mocked_time_in_transaction((select open_timestamp from ccbc_public.intake limit 1));


-- Table exists
select has_table(
  'ccbc_public', 'application_form_data',
  'ccbc_public.application_form_data should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'application_form_data', 'form_data_id','The table application has column form_data_id');
select has_column('ccbc_public', 'application_form_data', 'application_id','The table application has column application_id');

-- Row level security tests --

-- Test setup - first user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';


select ccbc_public.create_application();

-- Test setup - second user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111113';

select ccbc_public.create_application();
select ccbc_public.create_application();

set role ccbc_auth_user;

select results_eq(
  $$
    select count(*) from ccbc_public.application_form_data;
  $$,
  $$
    values (2::bigint)
  $$,
  'Should only show application form data related to owned applicatons'
);

select throws_like(
   $$
    insert into ccbc_public.application_form_data values (3, 1);
   $$,
   'new row violates row-level security policy for table "application_form_data"'
);

select finish();
rollback;
