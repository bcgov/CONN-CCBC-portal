begin;

select plan(7);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake
restart identity cascade;

select has_function('ccbc_public', 'create_application_sow_data',
  'Function create_application_sow_data should exist');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);
set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

set role ccbc_auth_user;

select ccbc_public.create_application();

-- set role to analyst
set role ccbc_analyst;

-- create sow data without amendment number
select ccbc_public.create_application_sow_data(1::int , '{}'::jsonb, null::int);

select results_eq (
  $$
    select amendment_number, is_amendment from ccbc_public.application_sow_data
    where application_id = 1 and amendment_number = 0
  $$,
  $$
  values (
    0::integer,
    false::boolean
  )
  $$,
  'Original sow data should have 0 as change request number and false as is_amendment'
);

-- create another and make sure the previous one is archived
select ccbc_public.create_application_sow_data(1::int , '{}'::jsonb, null::int);

select results_eq (
  $$
    select count(*) from ccbc_public.application_sow_data
    where application_id = 1 and amendment_number = 0 and archived_at is not null
  $$,
  $$
  values (
    1::bigint
  )
  $$,
  'Original sow data should be archived'
);

-- create sow data with change request number
select ccbc_public.create_application_sow_data(1::int , '{}'::jsonb, 1::int);

select results_eq (
  $$
    select amendment_number, is_amendment from ccbc_public.application_sow_data
    where application_id = 1 and amendment_number = 1
  $$,
  $$
  values (
    1::integer,
    true::boolean
  )
  $$,
  'Change request sow data should have 1 as change request number and true as is_amendment'
);

-- create another and make sure the previous one is archived

select ccbc_public.create_application_sow_data(1::int , '{}'::jsonb, 1::int);

select results_eq (
  $$
    select count(*) from ccbc_public.application_sow_data
    where application_id = 1 and amendment_number = 1 and archived_at is not null
  $$,
  $$
  values (
    1::bigint
  )
  $$,
  'Change request sow data should be archived'
);

-- has the correct number of sow data with archived_at
select results_eq (
  $$
    select count(*) from ccbc_public.application_sow_data
    where application_id = 1 and archived_at is null
  $$,
  $$
  values (
    2::bigint
  )
  $$,
  'Should have correct values'
);

-- has the correct number of sow data with archived_at = null
select results_eq (
  $$
    select count(*) from ccbc_public.application_sow_data
    where application_id = 1 and archived_at is not null
  $$,
  $$
  values (
    2::bigint
  )
  $$,
  'Should have correct values'
);



select finish();
rollback;
