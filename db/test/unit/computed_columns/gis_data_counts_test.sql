begin;

select plan(25);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.application_analyst_lead,
  ccbc_public.record_version,
  ccbc_public.ccbc_user,
  ccbc_public.gis_data,
  ccbc_public.application_gis_data
restart identity cascade;


select has_function(
  'ccbc_public', 'gis_data_counts',
  'Function gis_data_counts should exist'
);


select function_privs_are(
  'ccbc_public', 'gis_data_counts', ARRAY['integer'], 'ccbc_admin', ARRAY['EXECUTE']::text[],
  'ccbc_admin can execute ccbc_public.gis_data_counts()'
);

select function_privs_are(
  'ccbc_public', 'gis_data_counts', ARRAY['integer'], 'ccbc_analyst', ARRAY['EXECUTE']::text[],
  'ccbc_analyst can execute ccbc_public.gis_data_counts()'
);

select function_privs_are(
  'ccbc_public', 'gis_data_counts', ARRAY['integer'], 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user cannot execute ccbc_public.gis_data_counts()'
);

select function_privs_are(
  'ccbc_public', 'gis_data_counts', ARRAY['integer'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.gis_data_counts()'
);

\set test_data_1 '[{"ccbc_number":"CCBC-010001","number_of_households":100},{"ccbc_number":"CCBC-010002","number_of_households":200},{"ccbc_number":"CCBC-010004","number_of_households":1}]'
\set test_data_2 '[{"ccbc_number":"CCBC-010001","number_of_households":100},{"ccbc_number":"CCBC-010002","number_of_households":250},{"ccbc_number":"CCBC-010003","number_of_households":300}]'
\set test_data_3 '[{"ccbc_number":"CCBC-010001","number_of_households":200},{"ccbc_number":"CCBC-010002","number_of_households":350},{"ccbc_number":"CCBC-010003","number_of_households":400}]'

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1),
      ('2022-05-01 09:00:01-07', '2022-06-01 09:00:00-07', 2);
select mocks.set_mocked_time_in_transaction((select open_timestamp from ccbc_public.intake limit 1));

-- Test users
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111111'),
  ('foo2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111112'),
  ('foo3', 'bar', 'foo3@bar.com', '11111111-1111-1111-1111-111111111113');


set role ccbc_auth_user;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

insert into ccbc_public.application
  (id, ccbc_number, owner) overriding system value
   values
  (1,'CCBC-010001', '11111111-1111-1111-1111-111111111112');

insert into ccbc_public.application
  (id, ccbc_number, owner) overriding system value
   values
  (2,'CCBC-010002', '11111111-1111-1111-1111-111111111112');

insert into ccbc_public.application
  (id, ccbc_number, owner) overriding system value
   values
  (3,'CCBC-010003', '11111111-1111-1111-1111-111111111112');

-- set all applications to received
insert into ccbc_public.application_status
 (application_id, status) values (1,'received'), (2, 'received'), (3, 'received');

-- set role to analyst and create announcement
set role ccbc_analyst;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

-- receive GIS data
select * from ccbc_public.save_gis_data(:'test_data_1'::jsonb);
update ccbc_public.gis_data set created_at = '2023-05-01 08:00:00+00' where id = 1;

-- parse GIS data
select * from ccbc_public.parse_gis_data(1);

update ccbc_public.application_gis_data set created_at = '2023-05-01 09:00:00+00' where batch_id = 1;
-- update ccbc_public.application_gis_data set created_at = '2023-05-01 09:00:00+00' where application_id = 2;

  select results_eq (
    $$
    select created_at from ccbc_public.application_gis_data where application_id = 1 and batch_id = 1;
    $$,
    $$
      values('2023-05-01 09:00:00+00'::timestamp with time zone)
    $$,
    'Should have proper created_at for app id 1'
  );

  select results_eq (
    $$
    select created_at from ccbc_public.application_gis_data where application_id = 2 and batch_id = 1;
    $$,
    $$
      values('2023-05-01 09:00:00+00'::timestamp with time zone)
    $$,
    'Should have proper created_at for app id 2'
  );

  select results_eq (
    $$
    select count(*)::int from ccbc_public.application_gis_data where batch_id = 1;
    $$,
    $$
      values(2::int)
    $$,
    'Should have 2 app GIS data record with  batch_id 1'
  );

select results_eq (
  $$
  select total from ccbc_public.gis_data_counts(1) where count_type='new'
  $$,
  $$
    values(2::int)
  $$,
  'Should have two new records'
);

select results_eq (
  $$
  select ccbc_numbers from ccbc_public.gis_data_counts(1) where count_type='new'
  $$,
  $$
    values('CCBC-010001, CCBC-010002'::text)
  $$,
  'Should have proper CCBC numbers for new records'
);

select results_eq (
  $$
  select total from ccbc_public.gis_data_counts(1) where count_type='updated'
  $$,
  $$
    values(0::int)
  $$,
  'Should have no updated records'
);

select results_eq (
  $$
  select total from ccbc_public.gis_data_counts(1) where count_type='unchanged'
  $$,
  $$
    values(0::int)
  $$,
  'Should have no unchanged records'
);

select results_eq (
  $$
  select total from ccbc_public.gis_data_counts(1) where count_type='unmatched'
  $$,
  $$
    values(1::int)
  $$,
  'Should have one unmatched records'
);

select results_eq (
  $$
  select ccbc_numbers from ccbc_public.gis_data_counts(1) where count_type='unmatched'
  $$,
  $$
    values('CCBC-010004'::text)
  $$,
  'Should have proper CCBC numbers for unmatched records'
);

select results_eq (
  $$
  select total from ccbc_public.gis_data_counts(1) where count_type='total'
  $$,
  $$
    values(3::int)
  $$,
  'Should return total number of processed records'
);


-- new GIS data
select * from ccbc_public.save_gis_data(:'test_data_2'::jsonb);
update ccbc_public.gis_data set created_at = '2023-05-01 10:09:00+00' where id = 2;

-- need to parse GIS data for first batch to be able to get correct updated/new count
select * from ccbc_public.parse_gis_data(2);

update ccbc_public.application_gis_data set created_at = '2023-05-01 10:10:00+00' where batch_id = 2;

select results_eq (
  $$
  select total from ccbc_public.gis_data_counts(2) where count_type='new'
  $$,
  $$
    values(1::int)
  $$,
  'Should have one new records'
);

select results_eq (
  $$
  select ccbc_numbers from ccbc_public.gis_data_counts(2) where count_type='new'
  $$,
  $$
    values('CCBC-010003'::text)
  $$,
  'Should have proper CCBC numbers for new records'
);

select results_eq (
  $$
  select total from ccbc_public.gis_data_counts(2) where count_type='updated'
  $$,
  $$
    values(1::int)
  $$,
  'Should have one updated records'
);

select results_eq (
  $$
  select ccbc_numbers from ccbc_public.gis_data_counts(2) where count_type='updated'
  $$,
  $$
    values('CCBC-010002'::text)
  $$,
  'Should have proper CCBC numbers for updated records'
);

select results_eq (
  $$
  select total from ccbc_public.gis_data_counts(2) where count_type='total'
  $$,
  $$
    values(3::int)
  $$,
  'Should return total number of imported records'
);

-- change 2 application status to status that won't trigger GIS data parsing, leave one as received
insert into ccbc_public.application_status
 (application_id, status) values (2, 'approved'), (3, 'complete');

-- new GIS data
select * from ccbc_public.save_gis_data(:'test_data_3'::jsonb);
update ccbc_public.gis_data set created_at = '2023-05-02 10:09:00+00' where id = 3;

-- need to parse GIS data for first batch to be able to get correct updated/new count
select * from ccbc_public.parse_gis_data(3);

update ccbc_public.application_gis_data set created_at = '2023-05-02 10:10:00+00' where batch_id = 3;

select results_eq (
  $$
  select total from ccbc_public.gis_data_counts(3) where count_type='new'
  $$,
  $$
    values(0::int)
  $$,
  'Should have no new records'
);

select results_eq (
  $$
  select total from ccbc_public.gis_data_counts(3) where count_type='updated'
  $$,
  $$
    values(1::int)
  $$,
  'Should have 1 updated record'
);

select results_eq (
  $$
  select ccbc_numbers from ccbc_public.gis_data_counts(3) where count_type='updated'
  $$,
  $$
    values('CCBC-010001'::text)
  $$,
  'Should have proper CCBC numbers for updated records'
);

select results_eq (
  $$
  select total from ccbc_public.gis_data_counts(3) where count_type='not_imported'
  $$,
  $$
    values(2::int)
  $$,
  'Should return total number of imported records'
);

select results_eq (
  $$
  select total from ccbc_public.gis_data_counts(3) where count_type='total'
  $$,
  $$
    values(3::int)
  $$,
  'Should return total number of imported records'
);

\unset test_data_1
\unset test_data_2
select finish();

rollback;
