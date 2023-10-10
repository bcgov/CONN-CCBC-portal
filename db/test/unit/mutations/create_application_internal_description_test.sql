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

select has_function('ccbc_public', 'create_application_internal_description',
  'has create_application_internal_description function');

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

select results_eq(
  $$
    select id, description from ccbc_public.create_application_internal_description(1, 'test description'::text);
  $$,
  $$
    values (1,'test description'::text);
  $$,
  'Should return newly created application_internal_description'
);

-- create another and make sure the first one is archived
select ccbc_public.create_application_internal_description(1, 'test description 2'::text);

select results_eq(
  $$
    select count(*) from ccbc_public.application_internal_description where application_id = 1;
  $$,
  $$
    values(2::bigint);
  $$,
  'Should see two entries in application_internal_description for application 1'
);

select results_eq(
  $$
    select count(*) from ccbc_public.application_internal_description where application_id = 1 and archived_at is null;
  $$,
  $$
    values(1::bigint);
  $$,
  'Should see 1 entry in application_internal_description for application 1'
);

select finish();
rollback;
