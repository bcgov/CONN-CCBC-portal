begin;

select plan(5);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment
restart identity;

set jwt.claims.sub to 'testCcbcAuthUser';

set role ccbc_auth_user;

select results_eq(
  $$
    select id, owner, form_data, intake_id, ccbc_number from ccbc_public.create_application();
  $$,
  $$
    values (1,'testCcbcAuthUser'::varchar, '{}'::jsonb, null::int, null::varchar)
  $$,
  'Should return newly created application'
);

select results_eq(
  $$
    select application_id, status from ccbc_public.application_status where application_id = 1;
  $$,
  $$
    values (1, 'draft'::varchar)
  $$,
  'Should create draft status'
);

set role postgres;

delete from ccbc_public.intake;

set role ccbc_auth_user;

select throws_ok(
  $$
    select ccbc_public.create_application()
  $$,
  'There is no open intake',
  'Throws an error if there are no open intakes'
);

select function_privs_are(
  'ccbc_public', 'create_application', ARRAY[]::text[], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.create_application()'
);

select function_privs_are(
  'ccbc_public', 'create_application', ARRAY[]::text[], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.create_application()'
);

select finish();
rollback;
