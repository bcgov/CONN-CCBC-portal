begin;
select plan(4);

select has_table('ccbc_public', 'ccbc_user', 'table ccbc_public.ccbc_user exists');

insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, uuid) values
  ('user1', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111112'),
  ('user2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111113'),
  ('user3', 'bar', 'foo3@bar.com', '11111111-1111-1111-1111-111111111114');

-- Row level security tests --

-- Test setup - first user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

insert into ccbc_public.applications
  (ccbc_number, owner, form_data,status,last_edited_page) values
  ('CCBC-010001', '11111111-1111-1111-1111-111111111112','{}','draft','projectArea');

-- Test setup - second user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111113';
insert into ccbc_public.applications
  (ccbc_number, owner, form_data,status,last_edited_page) values
  ('CCBC-010002', '11111111-1111-1111-1111-111111111113','{}','draft','projectArea'),
  ('CCBC-010003', '11111111-1111-1111-1111-111111111113','{}','draft','projectArea');
-- ccbc_auth_user
set role ccbc_auth_user;
select concat('current user is: ', (select current_user));

-- Try to use first user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

select results_eq(
  $$
    select count(*) from ccbc_public.applications
  $$,
  ARRAY['1'::bigint],
    'user1 can see only own applications'
);

-- Try to use second user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111113';
select results_eq(
  $$
    select count(*) from ccbc_public.applications
  $$,
  ARRAY['2'::bigint],
    'user2 can see only own applications'
);

-- Try to use another user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111114';
select is_empty(
  $$
    select * from ccbc_public.applications
  $$,
    'user3 cannot see applications created by other users'
);

select finish();
rollback;
