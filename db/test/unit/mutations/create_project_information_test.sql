begin;

select plan(5);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake
restart identity cascade;

select has_function('ccbc_public', 'create_project_information',
'Function create_project_information should exist');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);
set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

set role ccbc_auth_user;

select ccbc_public.create_application();

-- ccbc_guest cannot create project_information

set role ccbc_guest;

select throws_like(
  $$
    select ccbc_public.create_project_information(1::int , '{}'::jsonb);
  $$,
  'permission denied%',
  'ccbc_guest cannot create project_information'
);

-- ccbc_auth_user cannot create project_information

set role ccbc_auth_user;

select throws_like(
  $$
    select ccbc_public.create_project_information(1::int , '{}'::jsonb);
  $$,
  'permission denied%',
  'ccbc_auth_user cannot create project_information'
);



-- set role to analyst and create project information
set role ccbc_analyst;
select ccbc_public.create_project_information(1::int , '{}'::jsonb);

select results_eq(
  $$
    select count(*) from ccbc_public.project_information_data where application_id = 1;
  $$,
  $$
    values(1::bigint);
  $$,
  'Should see 1 entry in project_information_data for application 1'
);

-- set role to admin and create project information

set role ccbc_admin;
select ccbc_public.create_project_information(1::int , '{}'::jsonb);

select results_eq(
  $$
    select count(*) from ccbc_public.project_information_data where application_id = 1;
  $$,
  $$
    values(2::bigint);
  $$,
  'Should see 2 entries in project_information_data for application 1'
);

select finish();
rollback;
