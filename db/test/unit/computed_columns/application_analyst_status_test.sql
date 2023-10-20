begin;

-- select plan(3);
select no_plan();

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake
restart identity cascade;

select function_privs_are(
  'ccbc_public', 'application_analyst_status', ARRAY['ccbc_public.application'], 'ccbc_analyst', ARRAY['EXECUTE'],
  'ccbc_analyst can execute ccbc_public.application_analyst_status(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_analyst_status', ARRAY['ccbc_public.application'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.application_analyst_status(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_analyst_status', ARRAY['ccbc_public.application'], 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user cannot execute ccbc_public.application_analyst_status(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_analyst_status', ARRAY['ccbc_public.application'], 'ccbc_admin', ARRAY['EXECUTE'],
  'ccbc_admin can execute ccbc_public.application_analyst_status(ccbc_public.application)'
);

insert into
  ccbc_public.intake(id, open_timestamp, close_timestamp, ccbc_intake_number)
overriding system value
values
  (1, '2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 1);

select mocks.set_mocked_time_in_transaction('2022-08-20 09:00:00 America/Vancouver'::timestamptz);

set jwt.claims.sub to 'testCcbcAuthUser';

insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

set role ccbc_auth_user;

select ccbc_public.create_application();

set role ccbc_admin;

insert into ccbc_public.application_status(application_id, status) values (1, 'received');

select results_eq (
  $$
    select ccbc_public.application_analyst_status(
      (select row(application.*)::ccbc_public.application from ccbc_public.application where id=1)
    );
  $$,
  $$
    values('received'::varchar)
  $$,
  'ccbc_public.application_analyst_status retrieves the most recent visible status'
);

insert into ccbc_public.application_status(application_id, status) values (1, 'applicant_conditionally_approved');

select results_eq (
  $$
    select ccbc_public.application_analyst_status(
      (select row(application.*)::ccbc_public.application from ccbc_public.application where id=1)
    );
  $$,
  $$
    values('received'::varchar)
  $$,
  'ccbc_public.application_analyst_status retrieves the correct status visible to an analyst'
);



select finish();
rollback;
