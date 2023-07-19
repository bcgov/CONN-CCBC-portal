begin;

select plan(12);

-- Table exists
select has_table(
  'ccbc_public', 'intake',
  'ccbc_public.intake should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'intake', 'id','The table intake has column id');
select has_column('ccbc_public', 'intake', 'open_timestamp','The table intake has column open_timestamp');
select has_column('ccbc_public', 'intake', 'close_timestamp','The table intake has column close_timestamp');
select has_column('ccbc_public', 'intake', 'ccbc_intake_number','The table intake has column ccbc_intake_number');
select has_column('ccbc_public', 'intake', 'application_number_seq_name','The table intake has column application_number_seq_name');
select has_column('ccbc_public', 'intake', 'counter_id', 'The table intake has column counter_id');
select has_column('ccbc_public', 'intake', 'description', 'The table intake has column description');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values
('2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 42),
('2023-08-19 09:00:00 America/Vancouver','2023-11-06 09:00:00 America/Vancouver', 56);

select table_privs_are(
  'ccbc_public', 'intake', 'ccbc_guest', ARRAY['SELECT'],
  'ccbc_guest can select from intake table'
);

select table_privs_are(
  'ccbc_public', 'intake', 'ccbc_auth_user', ARRAY['SELECT'],
  'ccbc_auth_user can select from intake table'
);

select table_privs_are(
  'ccbc_public', 'intake', 'ccbc_admin', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_admin can select, update, and insert on intake table'
);

select table_privs_are(
  'ccbc_public', 'intake', 'ccbc_analyst', ARRAY['SELECT'],
  'ccbc_auth_user can select from intake table'
);

select finish();

rollback;
