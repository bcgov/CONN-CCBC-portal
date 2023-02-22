begin;
select plan(5);

select has_function(
  'ccbc_public', 'receive_applications',
  'Function receive_applications should exist'
);

-- Test setup - user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111111');

delete from ccbc_public.intake;
delete from ccbc_public.application;
delete from ccbc_public.application_status;

insert into
  ccbc_public.intake(id, open_timestamp, close_timestamp, ccbc_intake_number)
overriding system value
values
  (1, '2021-08-19 09:00:00 America/Vancouver','2021-11-06 09:00:00 America/Vancouver', 1),
  (2, '2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 2);

insert into ccbc_public.application
  (id, ccbc_number, owner, intake_id) overriding system value
   values
  (1,'CCBC-010001', '11111111-1111-1111-1111-111111111111', 1),
  (2,'CCBC-010001', '11111111-1111-1111-1111-111111111112', 2),
  (3,'CCBC-010001', '11111111-1111-1111-1111-111111111113', 2),
  (4,'CCBC-010001', '11111111-1111-1111-1111-111111111113', 2);


insert into ccbc_public.application_status (application_id, status, created_at) VALUES
(1, 'submitted', '2021-08-19 09:00:00 America/Vancouver'),
(2, 'submitted', '2021-08-19 09:00:00 America/Vancouver'),
(3, 'submitted', '2021-08-19 09:00:00 America/Vancouver'),
(4, 'submitted', '2021-08-19 09:00:00 America/Vancouver');

set role ccbc_job_executor;

select results_eq(
  $$
    select count(*) from ccbc_public.application_status where status = 'submitted';
  $$,
  ARRAY['4'::bigint],
    'Count 4 rows where status is submitted'
);

select results_eq(
  $$
    select count(*) from ccbc_public.application_status where status = 'received';
  $$,
  ARRAY['0'::bigint],
    'Expect no rows where status is received'
);

-- intake 1 is closed, not intake 2
reset role;
select mocks.set_mocked_time_in_transaction('2022-08-19 09:00:01 America/Vancouver'::timestamptz);
set role ccbc_job_executor;

select * from ccbc_public.receive_applications();

select results_eq(
  $$
    select count(*) from ccbc_public.application_status where status = 'received';
  $$,
  ARRAY['1'::bigint],
    'Expect 1 rows where status is received'
);

-- both intakes closed
reset role;
select mocks.set_mocked_time_in_transaction('2022-11-06 09:00:01 America/Vancouver'::timestamptz);
set role ccbc_job_executor;
select * from ccbc_public.receive_applications();

select results_eq(
  $$
    select count(*) from ccbc_public.application_status where status = 'received';
  $$,
  ARRAY['4'::bigint],
    'Expect 4 rows where status is received'
);

select finish();

rollback;
