begin;

select plan(12);

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
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');
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

-- RFI always saves rfiAdditionalFiles object even when no files were selected
select ccbc_public.create_rfi(1, '{"rfiAdditionalFiles": {}}'::jsonb);

select results_eq (
  $$
  select ccbc_public.application_has_rfi_open(
    (select row(application.*)::ccbc_public.application from ccbc_public.application)
  )
  $$,
  $$
    values('f'::boolean)
  $$,
  'The current rfi is not open as no due date was set and no files were requested'
);

select ccbc_public.create_rfi(1, '{"rfiDueBy": "2022-04-01", "rfiAdditionalFiles": {"testField": "true"}}'::jsonb);

select results_eq (
  $$
  select ccbc_public.application_has_rfi_open(
    (select row(application.*)::ccbc_public.application from ccbc_public.application)
  )
  $$,
  $$
    values('t'::boolean)
  $$,
  'The current rfi is open with a due by date of current date and file fields exists'
);

select ccbc_public.create_rfi(1, '{"rfiDueBy": "2022-03-31", "rfiAdditionalFiles": {"testField": "true"}}'::jsonb);

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

select ccbc_public.create_rfi(1, '{"rfiDueBy": "2022-04-02", "rfiAdditionalFiles": {"testField": "true"}}'::jsonb);

select results_eq (
  $$
  select ccbc_public.application_has_rfi_open(
    (select row(application.*)::ccbc_public.application from ccbc_public.application)
  )
  $$,
  $$
    values('t'::boolean)
  $$,
  'The current rfi is open with a due by date after the current date and there are requested files'
);

select ccbc_public.create_rfi(1, '{"rfiDueBy": "2023-04-02", "rfiAdditionalFiles": {}}'::jsonb);

select results_eq (
  $$
  select ccbc_public.application_has_rfi_open(
    (select row(application.*)::ccbc_public.application from ccbc_public.application)
  )
  $$,
  $$
    values('f'::boolean)
  $$,
  'The current rfi is closed with no files requested'
);

select ccbc_public.create_rfi(1, '{"rfiDueBy": "2023-04-02", "rfiAdditionalFiles": {"testField": "true"}}'::jsonb);

select results_eq (
  $$
  select ccbc_public.application_has_rfi_open(
    (select row(application.*)::ccbc_public.application from ccbc_public.application)
  )
  $$,
  $$
    values('t'::boolean)
  $$,
  'The current rfi is open with files requested'
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
