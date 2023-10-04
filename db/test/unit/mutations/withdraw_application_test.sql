begin;

select plan(10);

select has_function(
  'ccbc_public', 'withdraw_application', ARRAY['int'],
  'Function withdraw_application should exist'
);

set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

insert into ccbc_public.application(id, owner) overriding system value
values
  (2, '00000000-0000-0000-0000-000000000000'),
  (3, '00000000-0000-0000-0000-000000000000'),
  (4, '00000000-0000-0000-0000-000000000000'),
  (5, '00000000-0000-0000-0000-000000000000'),
  (6, '00000000-0000-0000-0000-000000000000');


insert into ccbc_public.application_status(application_id, status)
VALUES
 (2, 'submitted'),
 (3, 'withdrawn'),
 (4, 'approved'),
 (5, 'complete'),
 (6, 'draft');

select throws_like(
  $$
    select ccbc_public.withdraw_application(3)
  $$,
  'Application is already withdrawn'
);

select throws_like(
  $$
    select ccbc_public.withdraw_application(4)
  $$,
  'Application cannot be withdrawn as it has status approved'
);

select throws_like(
  $$
    select ccbc_public.withdraw_application(5)
  $$,
  'Application cannot be withdrawn as it has status complete'
);

select throws_like(
  $$
    select ccbc_public.withdraw_application(6)
  $$,
  'Application cannot be withdrawn as it has status draft'
);

select is_empty(
  $$
    select * from ccbc_public.application_status where application_id=2 and status='withdrawn'
  $$,
  'There are no withdrawn application statuses'
);

select results_eq(
  $$
    select id, ccbc_number, intake_id from ccbc_public.withdraw_application(2)
  $$,
  $$
    values (2, null::varchar, null::int)
  $$,
  'Returns the application without removing the intake number'
);

select results_eq(
  $$
    select application_id, status from ccbc_public.application_status where application_id = 2 and status='withdrawn';
  $$,
  $$
    values (2, 'withdrawn'::varchar)
  $$,
  'Withdrawn status should be inserted to the application_status table'
);

select function_privs_are(
  'ccbc_public', 'withdraw_application', ARRAY['int']::text[], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.withdraw_application(int)'
);

select function_privs_are(
  'ccbc_public', 'withdraw_application', ARRAY['int'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.withdraw_application(int)'
);

-- TODO: Check to see if withdrawn form_data is committed

select finish();

rollback;
