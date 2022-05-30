begin;
select plan(11);

-- Test setup
create table ccbc_public.test_table
(
  id integer primary key generated always as identity
);

create table ccbc_public.test_table_specific_column_grants
(
  id integer primary key generated always as identity,
  allowed text,
  denied text
);

select has_function(
  'ccbc_private', 'grant_permissions',
  'Function grant_permissions should exist'
);

select throws_ok(
  $$
    select ccbc_private.grant_permissions('badoperation', 'test_table', 'ccbc_auth_user');
  $$,
  'P0001',
  'Invalid operation variable. Must be one of [select, insert, update, delete]',
  'Function grant_permissions throws an exception if the operation variable is not in (select, insert, update, delete)'
);

select table_privs_are (
  'ccbc_public',
  'test_table',
  'ccbc_auth_user',
  ARRAY[]::text[],
  'role ccbc_auth_user has not yet been granted any privileges on ccbc_public.test_table'
);

select lives_ok(
  $$
    select ccbc_private.grant_permissions('select', 'test_table', 'ccbc_auth_user');
  $$,
  'Function grants select'
);

select lives_ok(
  $$
    select ccbc_private.grant_permissions('insert', 'test_table', 'ccbc_auth_user');
  $$,
  'Function grants insert'
);

select lives_ok(
  $$
    select ccbc_private.grant_permissions('update', 'test_table', 'ccbc_auth_user');
  $$,
  'Function grants update'
);

select lives_ok(
  $$
    select ccbc_private.grant_permissions('delete', 'test_table', 'ccbc_auth_user');
  $$,
  'Function grants delete'
);

select table_privs_are (
  'ccbc_public',
  'test_table',
  'ccbc_auth_user',
  ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
  'role ccbc_auth_user has been granted select, insert, update, delete on ccbc_public.test_table'
);

select any_column_privs_are (
  'ccbc_public',
  'test_table_specific_column_grants',
  'ccbc_auth_user',
  ARRAY[]::text[],
  'role ccbc_auth_user has not yet been granted any privileges on columns in ccbc_public.test_table_specific_column_grants'
);

select lives_ok(
  $$
    select ccbc_private.grant_permissions('select', 'test_table_specific_column_grants', 'ccbc_auth_user', ARRAY['allowed']);
  $$,
  'Function grants select when specific columns are specified'
);

select column_privs_are (
  'ccbc_public',
  'test_table_specific_column_grants',
  'allowed',
  'ccbc_auth_user',
  ARRAY['SELECT'],
  'ccbc_auth_user has privilege SELECT only on column `allowed` in test_table_specific_column_grants'
);

select finish();
rollback;