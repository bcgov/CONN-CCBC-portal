begin;

select plan(8);

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

insert into
  ccbc_public.intake(id, open_timestamp, close_timestamp, ccbc_intake_number, hidden, hidden_code)
overriding system value
values
  (2, '2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 99, 'true', 'a21429f4-2147-4655-ae42-8ad782cf23ed'::uuid);

set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

select mocks.set_mocked_time_in_transaction('2022-08-19 09:00:00 America/Vancouver');

set role ccbc_auth_user;

select results_eq(
  $$
    select id, owner, intake_id, ccbc_number from ccbc_public.create_application('');
  $$,
  $$
    values (1,'testCcbcAuthUser'::varchar, null::int, null::varchar)
  $$,
  'Should return newly created application'
);

select results_eq(
    $$
    select id, owner, intake_id, ccbc_number from ccbc_public.create_application('a21429f4-2147-4655-ae42-8ad782cf23ed');
  $$,
  $$
    values (2,'testCcbcAuthUser'::varchar, 2::int, null::varchar)
  $$,
  'Should return newly created application with intake fixed to the hidden intake'
);

-- TODO: add test to find form_data here

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

delete from ccbc_public.application_form_data where application_id = 2;

delete from ccbc_public.application_status where application_id = 2;

delete from ccbc_public.application where id = 2;

delete from ccbc_public.intake where id = 1;

set role ccbc_auth_user;

select throws_ok(
  $$
    select ccbc_public.create_application('')
  $$,
  'There is no open intake',
  'Throws an error if there are no open public intakes when not given code'
);

select results_eq(
    $$
    select id, owner, intake_id, ccbc_number from ccbc_public.create_application('a21429f4-2147-4655-ae42-8ad782cf23ed');
  $$,
  $$
    values (3,'testCcbcAuthUser'::varchar, 2::int, null::varchar)
  $$,
  'Should return newly created application with intake fixed to the hidden intake and there is no open public intake'
);

set role postgres;

delete from ccbc_public.application_form_data;

delete from ccbc_public.application_status;

delete from ccbc_public.application;

delete from ccbc_public.intake;

set role ccbc_auth_user;

select throws_ok(
  $$
    select ccbc_public.create_application('')
  $$,
  'There is no open intake',
  'Throws an error if there are no open intakes'
);

select function_privs_are(
  'ccbc_public', 'create_application', ARRAY['text']::text[], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.create_application('')'
);

select function_privs_are(
  'ccbc_public', 'create_application', ARRAY['text']::text[], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.create_application('')'
);

select finish();
rollback;
