begin;

insert into ccbc_public.gapless_counter(id, counter) overriding system value
 values (1, 0), (2, 0) on conflict (id) do update set
 counter= excluded.counter;

insert into
  ccbc_public.intake(id, open_timestamp, close_timestamp, ccbc_intake_number, counter_id)
overriding system value
values
  (1, '2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 1, 1),
  (2, '2023-01-15 00:00:00 America/Vancouver','2023-03-15 00:00:00 America/Vancouver', 2, 2)
on conflict (id) do update set
open_timestamp = excluded.open_timestamp,
close_timestamp = excluded.close_timestamp,
ccbc_intake_number = excluded.ccbc_intake_number;

commit;
