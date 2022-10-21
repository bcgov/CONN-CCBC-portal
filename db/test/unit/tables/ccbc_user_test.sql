begin;
select plan(33);

select has_table('ccbc_public', 'ccbc_user', 'table ccbc_public.ccbc_user exists');
select has_column('ccbc_public', 'ccbc_user', 'id', 'table ccbc_public.ccbc_user has id column');
select has_column('ccbc_public', 'ccbc_user', 'given_name', 'table ccbc_public.ccbc_user has given_name column');
select has_column('ccbc_public', 'ccbc_user', 'family_name', 'table ccbc_public.ccbc_user has family_name column');
select has_column('ccbc_public', 'ccbc_user', 'email_address', 'table ccbc_public.ccbc_user has email_address column');
select has_column('ccbc_public', 'ccbc_user', 'session_sub', 'table ccbc_public.ccbc_user has uuid column');
select has_column('ccbc_public', 'ccbc_user', 'created_at', 'table ccbc_public.ccbc_user has created_at column');
select has_column('ccbc_public', 'ccbc_user', 'updated_at', 'table ccbc_public.ccbc_user has updated_at column');
select has_column('ccbc_public', 'ccbc_user', 'archived_at', 'table ccbc_public.ccbc_user has archived_at column');
select has_column('ccbc_public', 'ccbc_user', 'created_by', 'table ccbc_public.ccbc_user has created_by column');
select has_column('ccbc_public', 'ccbc_user', 'updated_by', 'table ccbc_public.ccbc_user has updated_by column');
select has_column('ccbc_public', 'ccbc_user', 'archived_by', 'table ccbc_public.ccbc_user has archived_by column');


insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111112'),
  ('foo2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111113'),
  ('foo3', 'bar', 'foo3@bar.com', '11111111-1111-1111-1111-111111111114'),
  ('foo4', 'bar', 'foo4@bar.com', '11111111-1111-1111-1111-111111111115');

-- Row level security tests --

-- ccbc_guest
set role ccbc_guest;

select throws_like(
  $$
    select session_sub from ccbc_public.ccbc_user
  $$,
  'permission denied%',
  'ccbc_guest cannot select'
);

select throws_like(
  $$
    insert into ccbc_public.ccbc_user (session_sub, given_name, family_name) values ('21111111-1111-1111-1111-111111111111', 'test', 'testerson');
  $$,
  'permission denied%',
  'ccbc_guest cannot insert'
);

select throws_like(
  $$
    delete from ccbc_public.ccbc_user where id=1
  $$,
  'permission denied%',
    'ccbc_guest cannot delete rows from table_ccbc_user'
);


-- ccbc_auth_user
set role ccbc_auth_user;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select lives_ok(
  $$
  insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo42@bar.com', '11111111-1111-1111-1111-111111111111');
  $$,
  'ccbc_auth_user can insert a record with their own session_sub'
);

select results_eq(
  $$
    select session_sub, email_address from ccbc_public.ccbc_user
  $$,
  $$
    values ('11111111-1111-1111-1111-111111111111'::varchar, 'foo42@bar.com'::varchar)
  $$,
  'ccbc_auth_user can only select their own session_sub'
);

select results_eq(
  $$
    with rows as (
      update ccbc_public.ccbc_user set given_name = 'test'
      where session_sub!=(select sub from ccbc_public.session())
      returning 1
    ) select count(*) from rows
  $$,
  $$
    values (0::bigint)
  $$,
  'attempting to update other users data does not update any record'
);

select throws_like(
  $$
    insert into ccbc_public.ccbc_user (session_sub, given_name, family_name)
    values ('31111111-1111-1111-1111-111111111111', 'test', 'test');
  $$,
   'new row violates row-level security policy for table "ccbc_user"',
  'ccbc_auth_user cannot insert a record where the session_sub does not match'
);

select throws_like(
  $$
    update ccbc_public.ccbc_user
    set session_sub = 'ca716545-a8d3-4034-819c-5e45b0e775c9'
    where session_sub = (select sub from ccbc_public.session())
  $$,
  'permission denied%',
    'ccbc_auth_user cannot update their session_sub'
);

select throws_like(
  $$
    delete from ccbc_public.ccbc_user where id=1
  $$,
  'permission denied%',
    'ccbc_auth_user cannot delete rows from table_ccbc_user'
);

reset role;
delete from ccbc_public.ccbc_user where session_sub = '11111111-1111-1111-1111-111111111111';

-- ccbc_admin
set role ccbc_admin;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select lives_ok(
  $$
  insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo42@bar.com', '11111111-1111-1111-1111-111111111111');
  $$,
  'ccbc_admin can insert a record with their own session_sub'
);

select results_eq(
  $$
    select session_sub, email_address from ccbc_public.ccbc_user
  $$,
  $$
    values
      ( '11111111-1111-1111-1111-111111111112'::varchar, 'foo1@bar.com'::varchar),
      ( '11111111-1111-1111-1111-111111111113'::varchar, 'foo2@bar.com'::varchar),
      ( '11111111-1111-1111-1111-111111111114'::varchar, 'foo3@bar.com'::varchar),
      ( '11111111-1111-1111-1111-111111111115'::varchar, 'foo4@bar.com'::varchar),
      ('11111111-1111-1111-1111-111111111111'::varchar, 'foo42@bar.com'::varchar);
  $$,
  'ccbc_admin can only select all users'
);

select results_eq(
  $$
    with rows as (
      update ccbc_public.ccbc_user set given_name = 'test'
      where session_sub!=(select sub from ccbc_public.session())
      returning 1
    ) select count(*) from rows
  $$,
  $$
    values (0::bigint)
  $$,
  'attempting to update other users data does not update any record'
);

select throws_like(
  $$
    insert into ccbc_public.ccbc_user (session_sub, given_name, family_name)
    values ('31111111-1111-1111-1111-111111111111', 'test', 'test');
  $$,
   'new row violates row-level security policy for table "ccbc_user"',
  'ccbc_admin cannot insert a record where the session_sub does not match'
);

select throws_like(
  $$
    update ccbc_public.ccbc_user
    set session_sub = 'ca716545-a8d3-4034-819c-5e45b0e775c9'
    where session_sub = (select sub from ccbc_public.session())
  $$,
  'permission denied%',
    'ccbc_admin cannot update their session_sub'
);

select throws_like(
  $$
    delete from ccbc_public.ccbc_user where id=1
  $$,
  'permission denied%',
    'ccbc_admin cannot delete rows from table_ccbc_user'
);

reset role;
delete from ccbc_public.ccbc_user where session_sub = '11111111-1111-1111-1111-111111111111';

-- ccbc_analyst
set role ccbc_analyst;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select lives_ok(
  $$
  insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo42@bar.com', '11111111-1111-1111-1111-111111111111');
  $$,
  'ccbc_analyst can insert a record with their own session_sub'
);

select results_eq(
  $$
    select session_sub, email_address from ccbc_public.ccbc_user
  $$,
  $$
    values
      ( '11111111-1111-1111-1111-111111111112'::varchar, 'foo1@bar.com'::varchar),
      ( '11111111-1111-1111-1111-111111111113'::varchar, 'foo2@bar.com'::varchar),
      ( '11111111-1111-1111-1111-111111111114'::varchar, 'foo3@bar.com'::varchar),
      ( '11111111-1111-1111-1111-111111111115'::varchar, 'foo4@bar.com'::varchar),
      ('11111111-1111-1111-1111-111111111111'::varchar, 'foo42@bar.com'::varchar);
  $$,
  'ccbc_analyst can only select all users'
);

select results_eq(
  $$
    with rows as (
      update ccbc_public.ccbc_user set given_name = 'test'
      where session_sub!=(select sub from ccbc_public.session())
      returning 1
    ) select count(*) from rows
  $$,
  $$
    values (0::bigint)
  $$,
  'attempting to update other users data does not update any record'
);

select throws_like(
  $$
    insert into ccbc_public.ccbc_user (session_sub, given_name, family_name)
    values ('31111111-1111-1111-1111-111111111111', 'test', 'test');
  $$,
   'new row violates row-level security policy for table "ccbc_user"',
  'ccbc_analyst cannot insert a record where the session_sub does not match'
);

select throws_like(
  $$
    update ccbc_public.ccbc_user
    set session_sub = 'ca716545-a8d3-4034-819c-5e45b0e775c9'
    where session_sub = (select sub from ccbc_public.session())
  $$,
  'permission denied%',
    'ccbc_analyst cannot update their session_sub'
);

select throws_like(
  $$
    delete from ccbc_public.ccbc_user where id=1
  $$,
  'permission denied%',
    'ccbc_analyst cannot delete rows from table_ccbc_user'
);

select finish();
rollback;
