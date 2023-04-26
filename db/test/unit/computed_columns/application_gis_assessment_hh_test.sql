begin;

select plan(6);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.application_package,
  ccbc_public.ccbc_user,
  ccbc_public.gis_data
restart identity cascade;

select has_function(
  'ccbc_public', 'application_gis_assessment_hh',
  'Function application_gis_assessment_hh should exist'
);

-- Test setup
insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2028-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);

set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

set role ccbc_auth_user;

select ccbc_public.create_application();

update ccbc_public.application set ccbc_number='CCBC-01001' where id=1;
insert into ccbc_public.application_status
 (application_id, status) values (1,'received');

set jwt.claims.sub to 'testCcbcAdminUser';

-- set role to analyst and save gis assessment hh
set role ccbc_analyst;
select ccbc_public.save_gis_assessment_hh(1::int , 10::float(2), 20::float(2));

select results_eq(
  $$
    select id, eligible, eligible_indigenous from ccbc_public.application_gis_assessment_hh(
      (select row(application.*)::ccbc_public.application
       from ccbc_public.application where id=1));
  $$,
  $$
    values(1, 10::float(2), 20::float(2));
  $$,
  'Should return the correct values'
);

select results_eq(
  $$
    select id from ccbc_public.application_gis_assessment_hh(
      (select row(application.*)::ccbc_public.application
       from ccbc_public.application where id=10));
  $$,
  $$
    values(null::integer);
  $$,
  'Should return null'
);


select function_privs_are(
  'ccbc_public', 'application_gis_assessment_hh', ARRAY['ccbc_public.application'], 'ccbc_admin', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.application_gis_assessment_hh(ccbc_public.application)'
);


select function_privs_are(
  'ccbc_public', 'application_gis_assessment_hh', ARRAY['ccbc_public.application'], 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user can execute ccbc_public.application_gis_assessment_hh(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_gis_assessment_hh', ARRAY['ccbc_public.application'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.application_gis_assessment_hh(ccbc_public.application)'
);
select finish();

rollback;
