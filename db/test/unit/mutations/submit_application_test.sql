begin;

select plan(6);

select has_function(
  'ccbc_public', 'submit_application', ARRAY['int'],
  'Function submit_application should exist'
);

delete from ccbc_public.intake;

insert into ccbc_public.applications(id, form_data, status, owner) overriding system value
values
  (1, '{}', 'draft', '00000000-0000-0000-0000-000000000000'),
  (2, '{}', 'submitted', '00000000-0000-0000-0000-000000000000'),
  (3, '{}', 'withdrawn', '00000000-0000-0000-0000-000000000000'),
  (4, '{}', 'draft', '00000000-0000-0000-0000-000000000000');


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
    select id, ccbc_number, status, intake_id from ccbc_public.submit_application(2)
  $$,
  $$
    values (2, null::varchar, 'submitted'::varchar, null::int)
  $$,
  'Returns the application without changing it if already submitted'
);

select results_eq(
  $$
    select id, ccbc_number, status, intake_id from ccbc_public.submit_application(1)
  $$,
  $$
    values (1, 'CCBC-100001'::varchar, 'submitted'::varchar, 42)
  $$,
  'Returns the application with an intake number if in draft'
);

select results_eq(
  $$
    select id, ccbc_number, status, intake_id from ccbc_public.submit_application(4)
  $$,
  $$
    values (4, 'CCBC-100002'::varchar, 'submitted'::varchar, 42)
  $$,
  'Increases the ccbc number when submitting applications'
);

select finish();

rollback;
