begin;

select plan(3);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.ccbc_user
restart identity cascade;

select has_function('ccbc_public', 'archive_application_milestone_data',
  'has create_application_milestone_data function');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);
set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

set role ccbc_auth_user;

select ccbc_public.create_application();


-- set role to analyst and create application milestone data
set role ccbc_analyst;
set jwt.claims.sub to 'testCcbcAnalyst';

select ccbc_public.create_application_milestone_excel_data(1::int , '{"milestoneFile": "a"}'::jsonb);

select ccbc_public.create_application_milestone_data(1,'{"milestoneFile": "a"}'::jsonb, 1, 1);

select ccbc_public.archive_application_milestone_data(1);

-- ensure that both the application_milestone_data and associated application_milestone_excel_data are archived
select results_eq (
  $$
    select count(*) from ccbc_public.application_milestone_data
    where application_id = 1 and archived_at is not null
  $$,
  $$
  values (
    1::bigint
  )
  $$,
  'There should be 1 archived milestone'
);

select results_eq (
  $$
    select count(*) from ccbc_public.application_milestone_excel_data
    where application_id = 1 and archived_at is not null
  $$,
  $$
  values (
    1::bigint
  )
  $$,
  'There should be 1 archived milestone excel data'
);

select finish();
rollback;
