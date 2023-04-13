begin;

select plan(3);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.application_analyst_lead
restart identity cascade;


select function_privs_are(
  'ccbc_public', 'application_external_status', ARRAY['ccbc_public.application'], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.application_external_status(ccbc_public.application)'
);
select function_privs_are(
  'ccbc_public', 'application_external_status', ARRAY['ccbc_public.application'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.application_external_status(ccbc_public.application)'
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

insert into ccbc_public.application_status
(id, application_id, status,created_by, created_at)
overriding system value
values
(2,1,'received',1,'2022-10-18 10:16:45.319172-07');

set role ccbc_admin;

set jwt.claims.sub to 'testCcbcAnalystUser';

insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('analyst', 'bar', 'analyst@bar.com', 'testCcbcAnalystUser');

insert into ccbc_public.application_status
(id, application_id, status,created_by, created_at)
overriding system value
values
(3,1,'assessment',2,'2022-10-19 10:16:45.319172-07');

set role ccbc_admin;

select is (
    (
        select ccbc_public.application_external_status(
            (select row(application.*)::ccbc_public.application from ccbc_public.application where id = 1)
        )
    ),
    'received'
);

select finish();

rollback;