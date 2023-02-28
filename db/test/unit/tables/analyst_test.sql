begin;
select plan(13);

select has_table('ccbc_public', 'analyst', 'table ccbc_public.analyst exists');
select has_column('ccbc_public', 'analyst', 'id', 'table ccbc_public.analyst has id column');
select has_column('ccbc_public', 'analyst', 'given_name', 'table ccbc_public.analyst has given_name column');
select has_column('ccbc_public', 'analyst', 'family_name', 'table ccbc_public.analyst has family_name column');
select has_column('ccbc_public', 'analyst', 'active', 'table ccbc_public.analyst has active column');

select table_privs_are(
  'ccbc_public', 'analyst', 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest has no permissions for analyst table'
);

select table_privs_are(
  'ccbc_public', 'analyst', 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user has no permissions for analyst table'
);

select table_privs_are(
  'ccbc_public', 'analyst', 'ccbc_admin', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_admin can select, insert and update from analyst table'
);

select table_privs_are(
  'ccbc_public', 'analyst', 'ccbc_analyst', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_analyst can select, insert and update from analyst table'
);

-- ccbc_guest
set role ccbc_guest;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select throws_like(
  $$
    select * from ccbc_public.analyst
  $$,
  'permission denied%',
  'ccbc_auth_user cannot select'
);

reset role;

-- ccbc_auth_user
set role ccbc_auth_user;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select throws_like(
  $$
    select * from ccbc_public.analyst
  $$,
  'permission denied%',
  'ccbc_auth_user cannot select'
);

reset role;

-- ccbc_admin
set role ccbc_admin;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select results_eq(
  $$
    select given_name, family_name from ccbc_public.analyst
  $$,
  $$
    values
      ('Rachel'::varchar, 'Greenspan'::varchar),
      ('Harpreet'::varchar, 'Bains'::varchar),
      ('Leslie'::varchar, 'Chiu'::varchar),
      ('Daniel'::varchar, 'Stanyer'::varchar),
      ('Justin'::varchar, 'Bauer'::varchar),
      ('Cyril'::varchar, 'Moersch'::varchar),
      ('Afshin'::varchar, 'Shaabany'::varchar),
      ('Ali'::varchar, 'Fathalian'::varchar),
      ('Maria'::varchar, 'Fuccenecco'::varchar),
      ('Hélène'::varchar, 'Payette'::varchar),
      ('Karl'::varchar, 'Lu'::varchar),
      ('Carreen'::varchar, 'Unguran'::varchar),
      ('Lia'::varchar, 'Pittappillil'::varchar);
  $$,
  'ccbc_admin can select all users'
);

reset role;

-- ccbc_analyst
set role ccbc_analyst;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select results_eq(
  $$
    select given_name, family_name from ccbc_public.analyst
  $$,
  $$
    values
      ('Rachel'::varchar, 'Greenspan'::varchar),
      ('Harpreet'::varchar, 'Bains'::varchar),
      ('Leslie'::varchar, 'Chiu'::varchar),
      ('Daniel'::varchar, 'Stanyer'::varchar),
      ('Justin'::varchar, 'Bauer'::varchar),
      ('Cyril'::varchar, 'Moersch'::varchar),
      ('Afshin'::varchar, 'Shaabany'::varchar),
      ('Ali'::varchar, 'Fathalian'::varchar),
      ('Maria'::varchar, 'Fuccenecco'::varchar),
      ('Hélène'::varchar, 'Payette'::varchar),
      ('Karl'::varchar, 'Lu'::varchar),
      ('Carreen'::varchar, 'Unguran'::varchar),
      ('Lia'::varchar, 'Pittappillil'::varchar);
  $$,
  'ccbc_analyst can select all users'
);

select finish();
rollback;
