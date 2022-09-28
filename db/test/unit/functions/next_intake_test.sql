begin;

select plan(3);

select has_function(
  'ccbc_public', 'next_intake',
  'Function next_intake should exist'
);

delete from ccbc_public.intake;

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1),
      ('2022-05-01 09:00:01-07', '2022-06-01 09:00:00-07', 2);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);

select is(
  (select ccbc_intake_number from ccbc_public.next_intake()),
  (values(2::int)),
  'The next_intake function returns the next intake when there is an upcoming intake'
);

select mocks.set_mocked_time_in_transaction('2022-05-02 09:00:01-07'::timestamptz);

select is(
  (select ccbc_intake_number from ccbc_public.next_intake()),
  (values(null::int)),
  'The next_intake function returns null when there is no upcoming intake'
);

select finish();

rollback;
