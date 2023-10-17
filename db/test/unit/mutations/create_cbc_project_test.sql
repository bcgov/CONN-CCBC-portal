begin;

select plan(3);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake
restart identity cascade;

select has_function('ccbc_public', 'create_cbc_project',
  'Function create_cbc_project should exist');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);
set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

set role ccbc_auth_user;

select ccbc_public.create_application('');

-- set role to analyst
set role ccbc_analyst;

select ccbc_public.create_cbc_project('{}'::jsonb);

select results_eq (
  $$
    select count(*) from ccbc_public.cbc_project
    where archived_at is null
  $$,
  $$
  values (
    1::bigint
  )
  $$,
  'Should crete cbc project data'
);

-- create another and make sure the previous one is archived

select ccbc_public.create_cbc_project('{}'::jsonb);

select results_eq (
  $$
    select count(*) from ccbc_public.cbc_project
    where archived_at is not null
  $$,
  $$
  values (
    1::bigint
  )
  $$,
  'Original cbc project data should be archived'
);

select finish();
rollback;
