begin;
SELECT plan(12);

-- Table exists
select has_table(
  'ccbc_public', 'application_status',
  'ccbc_public.application_status should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'application_status', 'id','The table application has column id');
select has_column('ccbc_public', 'application_status', 'application_id','The table application has column application_id');
select has_column('ccbc_public', 'application_status', 'status','The table application has column status');
select has_column('ccbc_public', 'application_status', 'change_reason','The table application has column change_reason');

-- Row level security tests --

-- Test setup - first user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111112');
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo3', 'bar', 'foo3@bar.com', '11111111-1111-1111-1111-111111111113');
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo4', 'bar', 'foo4@bar.com', '11111111-1111-1111-1111-111111111114');

insert into ccbc_public.application
  (id, ccbc_number, owner) overriding system value
   values
  (1,'CCBC-010001', '11111111-1111-1111-1111-111111111112');

insert into ccbc_public.application_status (application_id, status) VALUES (1, 'draft');

-- Test setup - second user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111113';
insert into ccbc_public.application
  (id, ccbc_number, owner) overriding system value
  values
  (2,'CCBC-010002', '11111111-1111-1111-1111-111111111113'),
  (3,'CCBC-010003', '11111111-1111-1111-1111-111111111113');

  insert into ccbc_public.application_status (application_id, status)
  VALUES
   (2, 'draft'),
   (3, 'draft');

set role ccbc_auth_user;

select results_eq(
  $$
    select count(*) status from ccbc_public.application_status;
  $$,
  $$
    values (2::bigint)
  $$,
  'Should only show statuses related to owned applicatons'
);

-- Test if use can update status of a non-owned application
select throws_ok(
  $$
    insert into ccbc_public.application_status (application_id,status) VALUES (1, 'submitted')
  $$,
  '42501',
  'new row violates row-level security policy for table "application_status"',
  'Will not allow user to update status of application it does not own'
);

-- Test setup - insert status
set jwt.claims.sub to '11111111-1111-1111-1111-111111111114';

set role ccbc_admin;
insert into ccbc_public.application_status (application_id, status) VALUES (1, 'submitted');
insert into ccbc_public.application_status (application_id, status) VALUES (1, 'received');
insert into ccbc_public.application_status (application_id, status) VALUES (1, 'on_hold');
insert into ccbc_public.application_status (application_id, status) VALUES (1, 'approved');

-- Test setup - first user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';
set role ccbc_auth_user;

-- Test to ensure ccbc_auth_user can only view application_status with allowed status types
select results_eq(
  $$
    select status from ccbc_public.application_status;
  $$,
  $$
    values ('draft'::varchar),
           ('submitted'::varchar),
           ('received'::varchar);
  $$,
  'Should only show allowed statuses for ccbc_auth_user'
);

-- Test to ensure ccbc_auth_user can only insert allowed status types

select lives_ok(
  $$
   insert into ccbc_public.application_status (application_id,status) VALUES (1, 'draft')
  $$,
  'ccbc_auth_user can insert application_status with allowed status type'
);

select lives_ok(
  $$
   insert into ccbc_public.application_status (application_id,status) VALUES (1, 'submitted')
  $$,
  'ccbc_auth_user can insert application_status with allowed status type'
);

select throws_ok(
  $$
    insert into ccbc_public.application_status (application_id,status) VALUES (1, 'approved')
  $$,
  '42501',
  'new row violates row-level security policy "application_status_insert_only_allowed" for table "application_status"',
  'Will not allow user to update status with disallowed status type'
);

select throws_ok(
  $$
    insert into ccbc_public.application_status (application_id,status) VALUES (1, 'on_hold')
  $$,
  '42501',
  'new row violates row-level security policy "application_status_insert_only_allowed" for table "application_status"',
  'Will not allow user to update status with disallowed status type'
);


select finish();
rollback;
