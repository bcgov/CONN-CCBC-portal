begin;

select plan(6);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.application_analyst_lead
restart identity cascade;

select has_function(
  'ccbc_public', 'application_organization_name',
  'Function application_organization_name should exist'
);

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);

set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');
set role ccbc_auth_user;

select ccbc_public.create_application();

select ccbc_public.create_application();
update ccbc_public.form_data set json_data = '{ "organizationProfile": {"organizationName": "org name" }}'::jsonb;

insert into ccbc_public.application_status (application_id, status) VALUES (1,'received');

set role ccbc_analyst;

select is (
  (
    select ccbc_public.application_organization_name(
      (select row(application.*)::ccbc_public.application from ccbc_public.application)
    )
  ),
  'org name',
  'application_organization_name retrieves the organization name from the form_data'
);

select function_privs_are(
  'ccbc_public', 'application_organization_name', ARRAY['ccbc_public.application'], 'ccbc_analyst', ARRAY['EXECUTE'],
  'ccbc_analyst can execute ccbc_public.application_organization_name(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_organization_name', ARRAY['ccbc_public.application'], 'ccbc_admin', ARRAY['EXECUTE'],
  'ccbc_admin can execute ccbc_public.application_organization_name(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_organization_name', ARRAY['ccbc_public.application'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.application_organization_name(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_organization_name', ARRAY['ccbc_public.application'], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.application_organization_name(ccbc_public.application)'
);

select finish();

rollback;
