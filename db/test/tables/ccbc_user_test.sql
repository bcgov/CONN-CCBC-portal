begin;
select plan(20);

select has_table('ccbc_public', 'ccbc_user', 'table ccbc_public.ccbc_user exists');
select has_column('ccbc_public', 'ccbc_user', 'id', 'table ccbc_public.ccbc_user has id column');
select has_column('ccbc_public', 'ccbc_user', 'given_name', 'table ccbc_public.ccbc_user has given_name column');
select has_column('ccbc_public', 'ccbc_user', 'family_name', 'table ccbc_public.ccbc_user has family_name column');
select has_column('ccbc_public', 'ccbc_user', 'email_address', 'table ccbc_public.ccbc_user has email_address column');
select has_column('ccbc_public', 'ccbc_user', 'uuid', 'table ccbc_public.ccbc_user has uuid column');
select has_column('ccbc_public', 'ccbc_user', 'created_at', 'table ccbc_public.ccbc_user has created_at column');
select has_column('ccbc_public', 'ccbc_user', 'updated_at', 'table ccbc_public.ccbc_user has updated_at column');
select has_column('ccbc_public', 'ccbc_user', 'archived_at', 'table ccbc_public.ccbc_user has archived_at column');
select has_column('ccbc_public', 'ccbc_user', 'created_by', 'table ccbc_public.ccbc_user has created_by column');
select has_column('ccbc_public', 'ccbc_user', 'updated_by', 'table ccbc_public.ccbc_user has updated_by column');
select has_column('ccbc_public', 'ccbc_user', 'archived_by', 'table ccbc_public.ccbc_user has archived_by column');


insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, uuid) values
  ('foo1', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111112'),
  ('foo2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111113'),
  ('foo3', 'bar', 'foo3@bar.com', '11111111-1111-1111-1111-111111111114'),
  ('foo4', 'bar', 'foo4@bar.com', '11111111-1111-1111-1111-111111111115');

-- Row level security tests --

-- Test setup
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

-- ccbc_auth_user
set role ccbc_auth_user;
select concat('current user is: ', (select current_user));

select results_eq(
  $$
    select count(*) from ccbc_public.ccbc_user
  $$,
  ARRAY['4'::bigint],
    'ccbc_auth_user can view all data from ccbc_user'
);

select lives_ok(
  $$
    update ccbc_public.ccbc_user set given_name = 'doood' where uuid=(select sub from ccbc_public.session())
  $$,
    'ccbc_auth_user can update data if their uuid matches the uuid of the row'
);

-- select results_eq(
--   $$
--     select given_name from ccbc_public.ccbc_user where uuid=(select sub from ccbc_public.session())
--   $$,
--   ARRAY['doood'::varchar(1000)],
--     'Data was changed by ccbc_auth_user'
-- );

select throws_like(
  $$
    update ccbc_public.ccbc_user set uuid = 'ca716545-a8d3-4034-819c-5e45b0e775c9' where uuid!=(select sub from ccbc_public.session())
  $$,
  'permission denied%',
    'ccbc_auth_user cannot update their uuid'
);

select throws_like(
  $$
    delete from ccbc_public.ccbc_user where id=1
  $$,
  'permission denied%',
    'ccbc_auth_user cannot delete rows from table_ccbc_user'
);

-- Try to update user data where uuid does not match
update ccbc_public.ccbc_user set given_name = 'buddy' where uuid!=(select sub from ccbc_public.session());

select is_empty(
  $$
    select * from ccbc_public.ccbc_user where given_name='buddy'
  $$,
    'ccbc_auth_user cannot update data if their uuid does not match the uuid of the row'
);

-- ccbc_guest
set role ccbc_guest;
select concat('current user is: ', (select current_user));

-- select results_eq(
--   $$
--     select uuid from ccbc_public.ccbc_user
--   $$,
--   ARRAY['11111111-1111-1111-1111-111111111111'::uuid],
--     'ccbc_guest can only select their own user'
-- );

select throws_like(
  $$
    update ccbc_public.ccbc_user set uuid = 'ca716545-a8d3-4034-819c-5e45b0e775c9' where uuid!=(select sub from ccbc_public.session())
  $$,
  'permission denied%',
    'ccbc_guest cannot update their uuid'
);

select throws_like(
  $$
    insert into ccbc_public.ccbc_user (uuid, given_name, family_name) values ('21111111-1111-1111-1111-111111111111'::uuid, 'test', 'testerson');
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

select finish();
rollback;