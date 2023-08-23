begin;

select plan(4);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.ccbc_user
restart identity cascade;

select has_function('ccbc_public', 'create_application_claims_data',
  'has create_application_claims_data function');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);
set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

set role ccbc_auth_user;

select ccbc_public.create_application();


-- set role to analyst and create application claims data
set role ccbc_analyst;
set jwt.claims.sub to 'testCcbcAnalyst';


select results_eq(
  $$
    select id, json_data from ccbc_public.create_application_claims_data(1,'{}'::jsonb);
  $$,
  $$
    values (1,'{}'::jsonb)
  $$,
  'Should return newly created claims data'
);

-- create a claim and pass in the old claims id
select id, json_data from ccbc_public.create_application_claims_data(1,'{}'::jsonb, 1);

select results_eq(
  $$
    select count(*) from ccbc_public.application_claims_data where application_id = 1;
  $$,
  $$
    values(2::bigint);
  $$,
  'Should see two entries in application_claims_data for application 1'
);

select results_eq(
  $$
    select count(*) from ccbc_public.application_claims_data where application_id = 1 and archived_at is null;
  $$,
  $$
    values(1::bigint);
  $$,
  'Should see 1 entry in application_claims_data for application 1 where arechived_at is null'
);

select finish();
rollback;
