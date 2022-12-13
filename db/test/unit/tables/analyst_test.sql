begin;
select plan(19);

select has_table('ccbc_public', 'analyst', 'table ccbc_public.analyst exists');
select has_column('ccbc_public', 'analyst', 'id', 'table ccbc_public.analyst has id column');
select has_column('ccbc_public', 'analyst', 'given_name', 'table ccbc_public.analyst has given_name column');
select has_column('ccbc_public', 'analyst', 'family_name', 'table ccbc_public.analyst has family_name column');
select has_column('ccbc_public', 'analyst', 'active', 'table ccbc_public.analyst has active column');


-- ccbc_guest
set role ccbc_guest;

select throws_like(
  $$
    select * from ccbc_public.analyst
  $$,
  'permission denied%',
  'ccbc_guest cannot select'
);

select throws_like(
  $$
    insert into ccbc_public.analyst (given_name, family_name) values ('test', 'test');
  $$,
  'permission denied%',
  'ccbc_guest cannot insert'
);

select throws_like(
  $$
    delete from ccbc_public.analyst where id=1
  $$,
  'permission denied%',
    'ccbc_guest cannot delete rows from table_analyst'
);

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

select throws_like(
  $$
    insert into ccbc_public.analyst (given_name, family_name) values ('test', 'test');
  $$,
  'permission denied%',
  'ccbc_auth_user cannot insert'
);

select throws_like(
  $$
    delete from ccbc_public.analyst where id=1
  $$,
  'permission denied%',
    'ccbc_auth_user cannot delete rows from table_analyst'
);

reset role;

-- ccbc_admin
set role ccbc_admin;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select throws_like(
  $$
    insert into ccbc_public.analyst (given_name, family_name) values ('test', 'test');
  $$,
  'permission denied%',
  'ccbc_admin cannot insert'
);

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
  'ccbc_admin can only select all users'
);

select throws_like(
  $$
    delete from ccbc_public.analyst where id=1
  $$,
  'permission denied%',
    'ccbc_admin cannot delete rows from table_analyst'
);

select throws_like(
  $$
    update ccbc_public.analyst
    set given_name = 'test2'
    where id=1
  $$,
  'permission denied%',
    'ccbc_admin cannot update'
);


reset role;


-- ccbc_analyst
set role ccbc_analyst;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select throws_like(
  $$
    insert into ccbc_public.analyst (given_name, family_name) values ('test', 'test');
  $$,
  'permission denied%',
  'ccbc_analyst cannot insert'
);

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
  'ccbc_analyst can only select all users'
);

select throws_like(
  $$
    delete from ccbc_public.analyst where id=1
  $$,
  'permission denied%',
    'ccbc_analyst cannot delete rows from table_analyst'
);

select throws_like(
  $$
    update ccbc_public.analyst
    set given_name = 'test2'
    where id=1
  $$,
  'permission denied%',
    'ccbc_analyst cannot update'
);

select finish();
rollback;
