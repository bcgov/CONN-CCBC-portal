begin;

select plan(9);

select has_function(
  'ccbc_public', 'submit_application', ARRAY['int'],
  'Function submit_application should exist'
);

delete from ccbc_public.intake;

set jwt.claims.sub to '00000000-0000-0000-0000-000000000000';

insert into ccbc_public.application(id, form_data, owner) overriding system value
values
  (1, '{"submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"}', '00000000-0000-0000-0000-000000000000'),
  (2, '{}', '00000000-0000-0000-0000-000000000000'),
  (3, '{}', '00000000-0000-0000-0000-000000000000'),
  (4, '{"submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"}', '00000000-0000-0000-0000-000000000000'),
  (5, '{"submission": {"submissionDate": "", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"}', '00000000-0000-0000-0000-000000000000'),
  (6, '{"submission": {"submissionDate": "2022-09-15", "submissionTitle": "", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"}', '00000000-0000-0000-0000-000000000000'),
  (7, '{"submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "", "submissionCompletedFor": "Testing Incorporated"}', '00000000-0000-0000-0000-000000000000'),
  (8, '{"submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": ""}', '00000000-0000-0000-0000-000000000000');

insert into ccbc_public.application_status(application_id, status)
values
  (1, 'draft'),
  (2, 'submitted'),
  (3, 'withdrawn'),
  (4, 'draft'),
  (5, 'draft'),
  (6, 'draft'),
  (7, 'draft'),
  (8, 'draft');

select throws_like(
  $$
    select ccbc_public.submit_application(1)
  $$,
  'There is no open intake, the application cannot be submitted',
  'Throws an exception when there is no open intake'
);

insert into ccbc_public.intake
  (id, open_timestamp, close_timestamp, ccbc_intake_number) overriding system value
  values (42, now(), now() + interval '10 days', 10);

select throws_like(
  $$
    select ccbc_public.submit_application(3)
  $$,
  'The application cannot be submitted as it has the following status: withdrawn',
  'Throws an exception when the application is withdrawn'
);

select results_eq(
  $$
    select application.id, application.ccbc_number, application_status.status , application.intake_id
    from ccbc_public.submit_application(2) as application,
     ccbc_public.application_status as application_status
     where application.id = application_status.application_id
     and application_status.status='submitted'
  $$,
  $$
    values (2, null::varchar, 'submitted'::varchar, null::int)
  $$,
  'Returns the application without changing it if already submitted'
);

select results_eq(
  $$
    select id, ccbc_number, intake_id from ccbc_public.submit_application(1)
  $$,
  $$
    values (1, 'CCBC-100001'::varchar, 42)
  $$,
  'Returns the application with an intake number if in draft'
);

select results_eq(
  $$
    select application_id, status from ccbc_public.application_status
      where application_id=1 and status='submitted'
  $$,
  $$
    values (1, 'submitted'::varchar)
  $$,
  'An application has been updated to submitted after'
);

select results_eq(
  $$
    select id, ccbc_number, intake_id from ccbc_public.submit_application(4)
  $$,
  $$
    values (4, 'CCBC-100002'::varchar, 42)
  $$,
  'Increases the ccbc number when submitting applications'
);

select throws_like(
  $$
    select ccbc_public.submit_application(5)
  $$,
  'The application cannot be submitted as the submission field submission_date is null or empty'
);

select throws_like(
  $$
    select ccbc_public.submit_application(6)
  $$,
  'The application cannot be submitted as the submission field submission_title is null or empty'
);

select throws_like(
  $$
    select ccbc_public.submit_application(7)
  $$,
  'The application cannot be submitted as the submission field submission_completed_for is null or empty'
);

select throws_like(
  $$
    select ccbc_public.submit_application(8)
  $$,
  'The application cannot be submitted as the submission field submission_completed_by is null or empty'
);

select function_privs_are(
  'ccbc_public', 'submit_application', ARRAY['int']::text[], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.submit_application(int)'
);

select function_privs_are(
  'ccbc_public', 'submit_application', ARRAY['int'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.submit_application(int)'
);

select finish();

rollback;
