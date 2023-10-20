begin;

select plan(3);
truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.application_analyst_lead
restart identity cascade;


insert into
  ccbc_public.intake(id, open_timestamp, close_timestamp, ccbc_intake_number)
overriding system value
values
  (1, '2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 1);
-- set the mocked time to within the intake day
select mocks.set_mocked_time_in_transaction('2022-08-20 09:00:00 America/Vancouver'::timestamptz);

set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');
set role ccbc_auth_user;

select ccbc_public.create_application();
update ccbc_public.form_data set json_data = '{ "projectInformation": {"projectTitle": "my title" }}'::jsonb;

select is (
  (
    select ccbc_public.application_project_name(
      (select row(application.*)::ccbc_public.application from ccbc_public.application)
    )
  ),
  'my title',
  'ccbc_public.application_project_name retrieves the application name from the form_data'
);

select function_privs_are(
  'ccbc_public', 'application_project_name', ARRAY['ccbc_public.application'], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.application_project_name(ccbc_public.application)'
);
select function_privs_are(
  'ccbc_public', 'application_project_name', ARRAY['ccbc_public.application'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.application_project_name(ccbc_public.application)'
);

select finish();

rollback;
