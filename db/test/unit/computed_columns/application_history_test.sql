begin;

select plan(6);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.application_analyst_lead,
  ccbc_public.record_version,
  ccbc_public.ccbc_user
restart identity cascade;

select has_function(
  'ccbc_public', 'application_history',
  'Function application_history should exist'
);

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2024-05-01 09:00:00-07', 1);

--select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);

set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');
set role ccbc_auth_user;

select ccbc_public.create_application();

set role ccbc_admin;

select results_eq (
  $$
  select count(*) from  ccbc_public.record_version 
  $$,
  $$
    values(2::bigint)
  $$,
  'Should have two records in record_version'
); 

set role ccbc_analyst;

select results_eq (
  $$
  select count(*) from (select ccbc_public.application_history(
    (select row(application.*)::ccbc_public.application from ccbc_public.application where id=1)) 
  ) as test
  $$,
  $$
    values(0::bigint)
  $$,
  'Should not get any record until application status is not received'
); 

set role ccbc_auth_user;

insert into ccbc_public.application_status (application_id, status) VALUES (1,'received');

set role ccbc_analyst;

select results_eq (
  $$
  select count(*) from (select ccbc_public.application_history(
    (select row(application.*)::ccbc_public.application from ccbc_public.application where id=1)) 
  ) as test
  $$,
  $$
    values(3::bigint)
  $$,
  'Should have three records: application created,  status set to draft and then status set to received'
);

-- RFI always saves rfiAdditionalFiles object even when no files were selected
select ccbc_public.create_rfi(1, '{"rfiAdditionalFiles": {}}'::jsonb);

select results_eq (
  $$
  select count(*) from (select ccbc_public.application_history(
    (select row(application.*)::ccbc_public.application from ccbc_public.application where id=1)) 
  ) as test
  $$,
  $$
    values(4::bigint)
  $$,
  'Should have four records: application created,  status set to draft, status set to received, rfi created'
);

set role ccbc_auth_user;

insert into ccbc_public.attachment(file_name, application_id) values ('foo', 1);

set role ccbc_analyst;

select results_eq (
  $$
  select count(*) from (select ccbc_public.application_history(
    (select row(application.*)::ccbc_public.application from ccbc_public.application where id=1)) 
  ) as test
  $$,
  $$
    values(5::bigint)
  $$,
  'Should have five records: application created,  status set to draft, status set to received, rfi created, attachment added'
);


select finish();

rollback;
