begin;
SELECT plan(6);

-- Table exists
select has_table(
  'ccbc_public', 'application_status',
  'ccbc_public.application_status should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'application_status', 'id','The table application has column id');
select has_column('ccbc_public', 'application_status', 'application_id','The table application has column application_id');
select has_column('ccbc_public', 'application_status', 'status','The table application has column status');

-- Row level security tests --

-- Test setup - first user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

insert into ccbc_public.application
  (id, ccbc_number, owner, form_data,last_edited_page) overriding system value
   values
  (1,'CCBC-010001', '11111111-1111-1111-1111-111111111112','{}','projectArea');

insert into ccbc_public.application_status (application_id, status) VALUES (1, 'draft');

-- Test setup - second user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111113';
insert into ccbc_public.application
  (id, ccbc_number, owner, form_data,last_edited_page) overriding system value
  values
  (2,'CCBC-010002', '11111111-1111-1111-1111-111111111113','{}','projectArea'),
  (3,'CCBC-010003', '11111111-1111-1111-1111-111111111113','{}','projectArea');

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

select finish();
rollback;
