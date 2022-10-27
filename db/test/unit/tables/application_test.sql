set client_min_messages to warning;
create extension if not exists pgtap;
reset client_min_messages;

begin;
SELECT plan(9);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data
restart identity;

-- Table exists
select has_table(
  'ccbc_public', 'application',
  'ccbc_public.application should exist and be a table'
);


-- Columns
select has_column('ccbc_public', 'application', 'id','The table application has column id');
select has_column('ccbc_public', 'application', 'ccbc_number','The table application has column ccbc_number');
select has_column('ccbc_public', 'application', 'owner','The table application has column owner');

insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('user1', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111112'),
  ('user2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111113'),
  ('user3', 'bar', 'foo3@bar.com', '11111111-1111-1111-1111-111111111114');

-- Row level security tests --

-- Test setup - first user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

insert into ccbc_public.application
  (ccbc_number, owner) values
  ('CCBC-010001', '11111111-1111-1111-1111-111111111112');

-- Test setup - second user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111113';
insert into ccbc_public.application
  (ccbc_number, owner) values
  ('CCBC-010002', '11111111-1111-1111-1111-111111111113'),
  ('CCBC-010003', '11111111-1111-1111-1111-111111111113');
-- ccbc_auth_user
set role ccbc_auth_user;
select concat('current user is: ', (select current_user));

-- Try to use first user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

select results_eq(
  $$
    select count(*) from ccbc_public.application
  $$,
  ARRAY['1'::bigint],
    'user1 can see only own application'
);

-- Try to use second user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111113';
select results_eq(
  $$
    select count(*) from ccbc_public.application
  $$,
  ARRAY['2'::bigint],
    'user2 can see only own application'
);

-- Try to use another user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111114';
select is_empty(
  $$
    select * from ccbc_public.application
  $$,
    'user3 cannot see application created by other users'
);

set role ccbc_analyst;

select is_empty(
  $$
    select * from ccbc_public.application
  $$,
  'analyst cannot see any applications as none are in the received state'
);

reset role;

insert into ccbc_public.application_status (application_id, status) values
(1,'received');

insert into ccbc_public.application_status (application_id, status) values
(1,'withdrawn');

set role ccbc_analyst;

select results_eq(
  $$
    select count(*) from ccbc_public.application
  $$,
  $$
    values(1::bigint)
  $$,
  'analyst can only see applications that are or have been in the received state'
);

select finish();
rollback;
