begin;

select plan(5);

truncate table
  ccbc_public.intake,
  ccbc_public.gapless_counter
restart identity cascade;


set jwt.claims.sub to 'testCcbcAdminUser';

select mocks.set_mocked_time_in_transaction('2022-08-19 09:00:00 America/Vancouver');

set role to ccbc_admin;


select results_eq(
  $$
    select open_timestamp, close_timestamp, ccbc_intake_number from ccbc_public.create_intake('2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver');
  $$,
  $$
    values ('2022-08-19 09:00:00 America/Vancouver'::timestamp with time zone, '2022-11-06 09:00:00 America/Vancouver'::timestamp with time zone, 1)
  $$,
  'Should return newly created intake with no description'
);

select results_eq($$
  select counter from ccbc_public.gapless_counter;
$$,
$$
  values (0)
$$,
'Row should start with count of 0');

select results_eq(
  $$
    select open_timestamp, close_timestamp, ccbc_intake_number, description from ccbc_public.create_intake('2023-08-19 09:00:00 America/Vancouver','2023-11-06 09:00:00 America/Vancouver', 'test');
  $$,
  $$
    values ('2023-08-19 09:00:00 America/Vancouver'::timestamp with time zone, '2023-11-06 09:00:00 America/Vancouver'::timestamp with time zone, 2, 'test'::text)
  $$,
  'Should return newly created intake with no description'
);

select throws_like(
  $$
     select open_timestamp, close_timestamp, ccbc_intake_number from ccbc_public.create_intake('2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver');  $$,
  'The start time for the new intake must be after the end time of the previous intake',
  'The intake start date must be after the end date of the previous intake'
);

select throws_like(
  $$
     select open_timestamp, close_timestamp, ccbc_intake_number from ccbc_public.create_intake('2022-08-19 09:00:00 America/Vancouver','2022-08-19 09:00:00 America/Vancouver');  $$,
  'The start date for the new intake must be before the end date',
  'The start date must be before the end date'
);

select finish();
rollback;
