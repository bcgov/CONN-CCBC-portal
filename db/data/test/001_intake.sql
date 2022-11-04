begin;

do
$$
begin

-- the sequence created when inserting an intake is owned by the ccbc_public.intake table,
-- so they have to be inserted by the table owner
execute format('set role to %I',(select tableowner from pg_tables where tablename = 'intake' and schemaname = 'ccbc_public'));

end
$$;

insert into
  ccbc_public.intake(id, open_timestamp, close_timestamp, ccbc_intake_number)
overriding system value
values
  (1, '2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 1),
  (2, '2023-01-15 00:00:00 America/Vancouver','2023-03-15 00:00:00 America/Vancouver', 2)
on conflict (id) do update set
open_timestamp = excluded.open_timestamp,
close_timestamp = excluded.close_timestamp,
ccbc_intake_number = excluded.ccbc_intake_number;

commit;
