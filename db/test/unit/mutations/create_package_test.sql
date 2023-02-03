begin;

select plan(3);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.application_package
restart identity cascade;

select has_function('ccbc_public', 'create_package',
'Function create_package should exist');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);
set jwt.claims.sub to 'testCcbcAuthUser';
set role ccbc_auth_user;

select ccbc_public.create_application();


-- set role to analyst and create application package
set role ccbc_analyst;
set jwt.claims.sub to 'testCcbcAnalyst';

select ccbc_public.create_package(1, 1);

select results_eq(
  $$
    select count(*) from ccbc_public.application_package where application_id = 1;
  $$,
  $$
    values(1::bigint);
  $$,
  'Should see 1 row in application_package for application 1'
);

select ccbc_public.create_package(1, 2);
select ccbc_public.create_package(1, 3);

select results_eq(
  $$
    select count(*) from ccbc_public.application_package where archived_at is null;
  $$,
  $$
    values(1::bigint);
  $$,
  'Should see 1 row in application_package for application 1 since previous application_package are set to archived'
);


select finish();
rollback;
