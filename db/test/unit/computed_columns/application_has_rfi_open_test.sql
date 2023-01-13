begin;

select plan(10);

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
  'ccbc_public', 'application_has_rfi_open',
  'Function application_has_rfi_open should exist'
);

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);

set jwt.claims.sub to 'testCcbcAuthUser';
set role ccbc_auth_user;

select ccbc_public.create_application();

insert into ccbc_public.application_status (application_id, status) VALUES (1,'received');

set role ccbc_analyst;

select results_eq (
  $$
  select ccbc_public.application_has_rfi_open(
    (select row(application.*)::ccbc_public.application from ccbc_public.application)
  )
  $$,
  $$
    values('f'::boolean)
  $$,
  'No existing open rfi '
);

select ccbc_public.create_rfi(1, '{}'::jsonb);

select results_eq (
  $$
  select ccbc_public.application_has_rfi_open(
    (select row(application.*)::ccbc_public.application from ccbc_public.application)
  )
  $$,
  $$
    values('f'::boolean)
  $$,
  'The current rfi is not open as no due date was set'
);

select ccbc_public.create_rfi(1, '{"rfiDueBy": "2022-04-01"}'::jsonb);

select results_eq (
  $$
  select ccbc_public.application_has_rfi_open(
    (select row(application.*)::ccbc_public.application from ccbc_public.application)
  )
  $$,
  $$
    values('t'::boolean)
  $$,
  'The current rfi is open with a due by date of current date'
);

select ccbc_public.create_rfi(1, '{"rfiDueBy": "2022-03-31"}'::jsonb);

select results_eq (
  $$
  select ccbc_public.application_has_rfi_open(
    (select row(application.*)::ccbc_public.application from ccbc_public.application)
  )
  $$,
  $$
    values('f'::boolean)
  $$,
  'The current rfi is closed with a due by date before the current date'
);

select ccbc_public.create_rfi(1, '{"rfiDueBy": "2022-04-02"}'::jsonb);

select results_eq (
  $$
  select ccbc_public.application_has_rfi_open(
    (select row(application.*)::ccbc_public.application from ccbc_public.application)
  )
  $$,
  $$
    values('t'::boolean)
  $$,
  'The current rfi is open with a due by date after the current date'
);

select function_privs_are(
  'ccbc_public', 'application_has_rfi_open', ARRAY['ccbc_public.application'], 'ccbc_analyst', ARRAY['EXECUTE']::text[],
  'ccbc_analyst can execute ccbc_public.application_has_rfi_open(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_has_rfi_open', ARRAY['ccbc_public.application'], 'ccbc_admin', ARRAY['EXECUTE']::text[],
  'ccbc_analyst can execute ccbc_public.application_has_rfi_open(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_has_rfi_open', ARRAY['ccbc_public.application'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.application_has_rfi_open(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_has_rfi_open', ARRAY['ccbc_public.application'], 'ccbc_auth_user', ARRAY['EXECUTE']::text[],
  'ccbc_auth_user can execute ccbc_public.application_has_rfi_open(ccbc_public.application)'
);

select finish();

rollback;
