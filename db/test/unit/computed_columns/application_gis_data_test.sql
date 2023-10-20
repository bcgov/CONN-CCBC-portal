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
  'ccbc_public', 'application_gis_data',
  'Function application_gis_data should exist'
);

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

set role to ccbc_admin;

insert into ccbc_public.gis_data (json_data)
  values ('[{"ccbc_number":"CCBC-01001"},{"ccbc_number":"CCBC-01002"}]'::jsonb);

select ccbc_public.parse_gis_data(1);

select results_eq(
  $$
    select id, json_data from ccbc_public.application_gis_data(
      (select row(application.*)::ccbc_public.application
       from ccbc_public.application where id=1));
  $$,
  $$
    values(1, '{"ccbc_number":"CCBC-01001"}'::jsonb);
  $$,
  'Should return the newly created assessment form'
);

select results_eq(
  $$
    select id from ccbc_public.application_gis_data(
      (select row(application.*)::ccbc_public.application
       from ccbc_public.application where id=10));
  $$,
  $$
    values(null::integer);
  $$,
  'Should return the newly created assessment form'
);


select function_privs_are(
  'ccbc_public', 'application_gis_data', ARRAY['ccbc_public.application'], 'ccbc_admin', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.application_gis_data(ccbc_public.application)'
);


select function_privs_are(
  'ccbc_public', 'application_gis_data', ARRAY['ccbc_public.application'], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.application_gis_data(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_gis_data', ARRAY['ccbc_public.application'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.application_gis_data(ccbc_public.application)'
);
select finish();

rollback;
