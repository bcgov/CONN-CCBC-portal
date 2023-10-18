begin;

select plan(4);

truncate table
  ccbc_public.intake,
  ccbc_public.gapless_counter
restart identity cascade;


set jwt.claims.sub to 'testCcbcAdminUser';

select mocks.set_mocked_time_in_transaction('2022-08-19 09:00:00 America/Vancouver');

set role to ccbc_admin;


select results_eq(
  $$
    select open_timestamp, close_timestamp, ccbc_intake_number, hidden, counter_id from ccbc_public.create_hidden_intake('2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver');
  $$,
  $$
    values ('2022-08-19 09:00:00 America/Vancouver'::timestamp with time zone, '2022-11-06 09:00:00 America/Vancouver'::timestamp with time zone, 99, 't'::boolean, 1)
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


select throws_like(
  $$
     select open_timestamp, close_timestamp, ccbc_intake_number from ccbc_public.create_hidden_intake('2022-08-19 09:00:00 America/Vancouver','2022-08-19 09:00:00 America/Vancouver');  $$,
  'The start date for the new intake must be before the end date',
  'The start date for the new intake must be before the end date'
);

select throws_like(
  $$
     select open_timestamp, close_timestamp, ccbc_intake_number from ccbc_public.create_hidden_intake('2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver');  $$,
  'Cannot have more than one hidden intake, please update intake end time',
  'Cannot have more than one unarchived hidden intake'
);

select finish();
rollback;
