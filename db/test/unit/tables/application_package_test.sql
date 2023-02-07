begin;

select plan(11);

-- Table exists
select has_table(
  'ccbc_public', 'application_package',
  'ccbc_public.application_package should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'application_package', 'id','The table attachment has column id');
select has_column('ccbc_public', 'application_package', 'application_id','The table attachment has column application_id');
select has_column('ccbc_public', 'application_package', 'package','The table attachment has column package');

-- Privileges
select table_privs_are(
  'ccbc_public', 'application_package', 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest has no privileges from attachment table'
);

select table_privs_are(
  'ccbc_public', 'application_package', 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user has no privileges from attachment table'
);

select table_privs_are(
  'ccbc_public', 'application_package', 'ccbc_admin', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_admin can select, insert and update from attachment table'
);

select table_privs_are(
  'ccbc_public', 'application_package', 'ccbc_analyst', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_analyst can select, insert and update from attachment table'
);

-- Test setup
insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);

insert into ccbc_public.application
  (id, ccbc_number, owner) overriding system value
   values
  (1,'CCBC-010001', '11111111-1111-1111-1111-111111111112');


-- Package column type check tests

set role ccbc_analyst;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select throws_like(
  $$
    insert into ccbc_public.application_package (application_id, package) values (1, 0);
  $$,
  'new row for relation "application_package" violates check constraint "application_package_package_check"',
  'cannot insert package with value of 0'
);

select throws_like(
  $$
    insert into ccbc_public.application_package (application_id, package) values (1, -10);
  $$,
  'new row for relation "application_package" violates check constraint "application_package_package_check"',
  'cannot insert package with negative number'
);

select lives_ok(
  $$
    insert into ccbc_public.application_package (application_id, package) values (1, 10);
  $$,
  'can insert package with positive number'
);


select finish();
rollback;
