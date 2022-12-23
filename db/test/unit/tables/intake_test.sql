begin;

select plan(16);

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

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values
('2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 42),
('2023-08-19 09:00:00 America/Vancouver','2023-11-06 09:00:00 America/Vancouver', 56);

select is (
  (select application_number_seq_name from ccbc_public.intake where ccbc_intake_number = 42),
  (values ('ccbc_public.intake_42_application_number_seq'::varchar)),
  'The sequence name is created with the expected naming convention'
);

select is (
  (select application_number_seq_name from ccbc_public.intake where ccbc_intake_number = 56),
  (values ('ccbc_public.intake_56_application_number_seq'::varchar)),
  'The sequence name is created with the expected naming convention'
);

select has_sequence('ccbc_public','intake_42_application_number_seq', 'A sequence was created for intake 42');
select has_sequence('ccbc_public','intake_56_application_number_seq', 'A sequence was created for intake 56');

select sequence_privs_are(
  'ccbc_public', 'intake_42_application_number_seq', 'ccbc_auth_user', ARRAY['USAGE', 'SELECT'],
  'ccbc_auth_user should be able to use and select intake_42_application_number_seq'
);

select sequence_privs_are(
  'ccbc_public', 'intake_56_application_number_seq', 'ccbc_auth_user', ARRAY['USAGE', 'SELECT'],
  'ccbc_auth_user should be able to use and select intake_56_application_number_seq'
);

select table_privs_are(
  'ccbc_public', 'intake', 'ccbc_guest', ARRAY['SELECT'],
  'ccbc_guest can select from intake table'
);

select table_privs_are(
  'ccbc_public', 'intake', 'ccbc_auth_user', ARRAY['SELECT'],
  'ccbc_auth_user can select from intake table'
);

select table_privs_are(
  'ccbc_public', 'intake', 'ccbc_admin', ARRAY['SELECT'],
  'ccbc_guest can select from intake table'
);

select table_privs_are(
  'ccbc_public', 'intake', 'ccbc_analyst', ARRAY['SELECT'],
  'ccbc_auth_user can select from intake table'
);

select finish();

rollback;
