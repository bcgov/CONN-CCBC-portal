begin;

do
$$
begin

-- the sequence created when inserting an intake is owned by the ccbc_public.intake table,
-- so they have to be inserted by the table owner
execute format('set role to %I',(select tableowner from pg_tables where tablename = 'intake' and schemaname = 'ccbc_public'));

end
$$;

truncate table
  ccbc_public.record_version,
  ccbc_public.ccbc_user
restart identity cascade;

insert into ccbc_public.gapless_counter(id, counter) overriding system value
 values (1, 0), (2, 0) on conflict (id) do update set
 counter= excluded.counter;

insert into
  ccbc_public.intake(id, open_timestamp, close_timestamp, ccbc_intake_number, counter_id, hidden)
overriding system value
values
  (99, '2023-01-01 09:00:00 America/Vancouver','2025-01-01 09:00:00 America/Vancouver', 99, 1, 1)
on conflict (id) do update set
open_timestamp = excluded.open_timestamp,
close_timestamp = excluded.close_timestamp,
ccbc_intake_number = excluded.ccbc_intake_number;

commit;
