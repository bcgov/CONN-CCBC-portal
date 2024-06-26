begin;

select plan(6);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.ccbc_user
restart identity cascade;

select has_function('ccbc_public', 'create_application_community_progress_report_data',
  'has create_application_community_progress_report_data function');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);
set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

set role ccbc_auth_user;

select ccbc_public.create_application();


-- set role to analyst and create application community progress report data
set role ccbc_analyst;
set jwt.claims.sub to 'testCcbcAnalyst';
insert into ccbc_public.application_community_report_excel_data(application_id) VALUES (1);

select results_eq(
  $$
    select id, json_data from ccbc_public.create_application_community_progress_report_data(1,'{}'::jsonb, null, 1);
  $$,
  $$
    values (1,'{}'::jsonb)
  $$,
  'Should return newly created community progress report data'
);

-- should archived previously inserted excel data
select ccbc_public.create_application_community_progress_report_data(1,'{}'::jsonb, 1, 1);

select is_empty(
  $$
  select * from ccbc_public.application_community_report_excel_data where archived_at is null;
  $$,
  'Should  not find an unarchived community_report_excel_data'
);

select isnt_empty(
  $$
  select * from ccbc_public.application_community_report_excel_data where archived_at is not null;
  $$,
  'Should find an archived community_report_excel_data'
);

select results_eq(
  $$
    select count(*) from ccbc_public.application_community_progress_report_data where application_id = 1;
  $$,
  $$
    values(2::bigint);
  $$,
  'Should see two entries in application_community_progress_report_data for application 1'
);

select results_eq(
  $$
    select count(*) from ccbc_public.application_community_progress_report_data where application_id = 1 and archived_at is null;
  $$,
  $$
    values(1::bigint);
  $$,
  'Should see 1 entry in application_community_progress_report_data for application 1'
);

select finish();
rollback;
