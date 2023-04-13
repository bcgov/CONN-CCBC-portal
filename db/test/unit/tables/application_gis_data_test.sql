begin;

select plan(10);

truncate table
  ccbc_public.rfi_data,
  ccbc_public.application_gis_data,
  ccbc_public.form_data,
  ccbc_public.application_status,
  ccbc_public.application_form_data,
  ccbc_public.application_gis_data,
  ccbc_public.application,
  ccbc_public.intake, 
  ccbc_public.gis_data
restart identity cascade;

-- table exists
select has_table(
  'ccbc_public', 'application_gis_data',
  'ccbc_public.application_gis_data should exist and be a table'
);

-- Columns

select has_column('ccbc_public', 'application_gis_data', 'id','The table application has column id');
select has_column('ccbc_public', 'application_gis_data', 'batch_id','The table application has column batch_id');
select has_column('ccbc_public', 'application_gis_data', 'application_id','The table application has column application_id');
select has_column('ccbc_public', 'application_gis_data', 'json_data','The table application has column json_data');

-- Privileges
select table_privs_are(
  'ccbc_public', 'application_gis_data', 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest has no privileges from application_gis_data table'
);

select table_privs_are(
  'ccbc_public', 'application_gis_data', 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user has no privileges from application_gis_data table'
);

select table_privs_are(
  'ccbc_public', 'application_gis_data', 'ccbc_admin', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_admin can select, insert and update from application_gis_data table'
);

select table_privs_are(
  'ccbc_public', 'application_gis_data', 'ccbc_analyst', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_analyst can select, insert and update from application_gis_data table'
);

-- Test setup
insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);

set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111112');

insert into ccbc_public.application
  (id, ccbc_number, owner) overriding system value
   values
  (1,'CCBC-010001', '11111111-1111-1111-1111-111111111112');


set jwt.claims.sub to 'testCcbcAdminUser';

set role to ccbc_admin;
select ccbc_public.save_gis_data('[{}]'::jsonb);

insert into ccbc_public.application_gis_data
  (id, batch_id, application_id, json_data) overriding system value
   values
  (1, 1, 1, '{}'::jsonb);

select results_eq(
  $$
    select json_data, id from ccbc_public.application_gis_data;
  $$,
  $$
    values('{}'::jsonb, 1)
  $$,
  'Should be able to view your own entry'
);

select finish();

rollback;
