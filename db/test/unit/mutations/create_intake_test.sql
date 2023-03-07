begin;

select plan(2);

truncate table
  ccbc_public.intake,
  ccbc_public.gapless_counter
restart identity cascade;


set jwt.claims.sub to 'testCcbcAdminUser';

select mocks.set_mocked_time_in_transaction('2022-08-19 09:00:00 America/Vancouver');

set role to ccbc_admin;

select results_eq(
  $$
    select open_timestamp, close_timestamp, ccbc_intake_number from ccbc_public.create_intake('2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 42);
  $$,
  $$
    values ('2022-08-19 09:00:00 America/Vancouver'::timestamp with time zone, '2022-11-06 09:00:00 America/Vancouver'::timestamp with time zone, 42)
  $$,
  'Should return newly created RFI'
);

select results_eq($$
  select counter from ccbc_public.gapless_counter;
$$,
$$
  values (0)
$$,
'Row should start with count of 0');

select finish();
rollback;
