begin;

<<<<<<< HEAD
select plan(3);
=======
select plan(2);
>>>>>>> 29ffc2e1 (feat: add application_amendment_numbers computed column)

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake
restart identity cascade;

select has_function('ccbc_public', 'application_amendment_numbers',
'Function amendment_numbers should exist');

insert into
  ccbc_public.intake(id, open_timestamp, close_timestamp, ccbc_intake_number)
overriding system value
values
  (1, '2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 1);

select mocks.set_mocked_time_in_transaction('2022-08-20 09:00:00 America/Vancouver'::timestamptz);

set jwt.claims.sub to 'testCcbcAuthUser';

insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

set role ccbc_auth_user;

select ccbc_public.create_application();

insert into ccbc_public.application_status
(id, application_id, status,created_by, created_at)
overriding system value
values
(2,1,'received',1,'2022-10-18 10:16:45.319172-07');

<<<<<<< HEAD
-- set role to analyst
set role ccbc_analyst;

select is (
  (
    select ccbc_public.application_amendment_numbers(
      (select row(application.*)::ccbc_public.application from ccbc_public.application where id = 1)
    )
  ),
  '0',
  'ccbc_public.application_amendment_numbers should return 0 when there is no change requests as it is reserved for original sow data'
);

-- create some change requests
=======
-- set role to analyst and create some change requests
set role ccbc_analyst;
>>>>>>> 29ffc2e1 (feat: add application_amendment_numbers computed column)
select ccbc_public.create_change_request(1::int , 1::int, '{}'::jsonb);
select ccbc_public.create_change_request(1::int , 2::int, '{}'::jsonb);
select ccbc_public.create_change_request(1::int , 6::int, '{}'::jsonb);
select ccbc_public.create_change_request(1::int , 10::int, '{}'::jsonb);
select ccbc_public.create_change_request(1::int , 20::int, '{}'::jsonb);

select is (
  (
    select ccbc_public.application_amendment_numbers(
      (select row(application.*)::ccbc_public.application from ccbc_public.application where id = 1)
    )
  ),
  '0 1 2 6 10 20',
  'ccbc_public.application_amendment_numbers should return space separated list of amendment numbers'
);


select finish();
rollback;
