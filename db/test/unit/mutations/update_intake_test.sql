begin;

select plan(4);

truncate table
  ccbc_public.intake,
  ccbc_public.gapless_counter
restart identity cascade;

select has_function(
  'ccbc_public',
  'update_intake',
  'Function to update intakes for the ccbc admin'
);

set jwt.claims.sub to 'testCcbcAdminUser';

select mocks.set_mocked_time_in_transaction('2022-08-19 09:00:00 America/Vancouver');

set role to ccbc_admin;


select ccbc_public.create_intake('2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver');
select ccbc_public.create_intake('2022-12-06 09:00:00 America/Vancouver','2023-01-29 09:00:00 America/Vancouver');
select ccbc_public.create_intake('2023-03-06 09:00:00 America/Vancouver','2023-05-02 09:00:00 America/Vancouver');


select throws_like(
  $$
     select ccbc_public.update_intake(2, '2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver');  $$,
  'The start time for the intake must be after the end time of the previous intake'
);

select throws_like(
  $$
     select open_timestamp, close_timestamp, ccbc_intake_number from ccbc_public.update_intake(1, '2022-08-19 09:00:00 America/Vancouver','2023-01-19 09:00:00 America/Vancouver');  $$,
  'The end time for the intake must be before the start time of the next intake'
);

select throws_like(
  $$
     select open_timestamp, close_timestamp, ccbc_intake_number from ccbc_public.update_intake(1, '2022-08-19 09:00:00 America/Vancouver','2022-08-19 09:00:00 America/Vancouver');  $$,
  'The start date for the intake must be before the end date'
);

select finish();
rollback;
