begin;

select plan(4);

truncate table
  ccbc_public.intake,
  ccbc_public.gapless_counter
restart identity cascade;


set jwt.claims.sub to 'testCcbcAdminUser';

select mocks.set_mocked_time_in_transaction('2022-08-19 09:00:00 America/Vancouver');

set role to ccbc_admin;

select ccbc_public.create_intake('2022-08-20 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver');

select ccbc_public.create_intake('2023-08-20 09:00:00 America/Vancouver','2023-11-06 09:00:00 America/Vancouver');

-- switch roles so we can mock a new time and test that archive_intake can't archive previous or current intakes
set role to postgres;

select mocks.set_mocked_time_in_transaction('2022-08-21 09:00:00 America/Vancouver');

set role to ccbc_admin;

select throws_like(
  $$
     select from ccbc_public.archive_intake(1);
  $$,
  'Cannot archive previous or current intakes',
  'archive_intake should not be able to archive previous or current intakes'
);

select results_eq(
  $$
    select count(*) from ccbc_public.intake;
  $$,
  $$
    values(2::bigint);
  $$,
  'Should see 2 intakes'
);

select results_eq(
  $$
    select ccbc_intake_number from ccbc_public.archive_intake(2);
  $$,
  $$
    values(2::integer);
  $$,
  'Should archive ccbc_intake_number 2'
);

select results_eq(
  $$
    select count(*) from ccbc_public.intake where archived_at is not null;
  $$,
  $$
    values(1::bigint);
  $$,
  'Should count 1 archived intake'
);

select finish();
rollback;
