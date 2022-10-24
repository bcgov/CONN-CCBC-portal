begin;
select plan(10);

select has_function(
  'ccbc_public', 'create_user_from_session',
  'Function create_user_from_session should exist'
);

-- Add a user via create_user_from_session()
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';
set jwt.claims.given_name to 'Bob';
set jwt.claims.family_name to 'Loblaw';
set jwt.claims.email to 'bob.loblaw@gov.bc.ca';

-- ccbc_auth_user tests
set role ccbc_auth_user;

select ccbc_public.create_user_from_session();

select results_eq (
  $$
    select given_name, family_name, email_address, session_sub
    from ccbc_public.ccbc_user
    where session_sub = '11111111-1111-1111-1111-111111111111'
  $$,
  $$
  values (
    'Bob'::varchar(1000),
    'Loblaw'::varchar(1000),
    'bob.loblaw@gov.bc.ca'::varchar(1000),
    '11111111-1111-1111-1111-111111111111'::varchar(1000)
  )
  $$,
  'create_user_from_session() successfully creates a user'
);

select function_privs_are(
  'ccbc_public', 'create_user_from_session', ARRAY[]::text[], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.create_user_from_session()'
);

select function_privs_are(
  'ccbc_public', 'create_user_from_session', ARRAY[]::text[], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.create_user_from_session()'
);


-- ccbc_admin tests
reset role;
delete from ccbc_public.ccbc_user where session_sub = '11111111-1111-1111-1111-111111111111';

set role ccbc_admin;

select ccbc_public.create_user_from_session();

select results_eq (
  $$
    select given_name, family_name, email_address, session_sub
    from ccbc_public.ccbc_user
    where session_sub = '11111111-1111-1111-1111-111111111111'
  $$,
  $$
  values (
    'Bob'::varchar(1000),
    'Loblaw'::varchar(1000),
    'bob.loblaw@gov.bc.ca'::varchar(1000),
    '11111111-1111-1111-1111-111111111111'::varchar(1000)
  )
  $$,
  'create_user_from_session() successfully creates a user'
);

select function_privs_are(
  'ccbc_public', 'create_user_from_session', ARRAY[]::text[], 'ccbc_admin', ARRAY['EXECUTE'],
  'ccbc_admin can execute ccbc_public.create_user_from_session()'
);

select function_privs_are(
  'ccbc_public', 'create_user_from_session', ARRAY[]::text[], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.create_user_from_session()'
);

-- ccbc_analyst tests
reset role;
delete from ccbc_public.ccbc_user where session_sub = '11111111-1111-1111-1111-111111111111';


set role ccbc_analyst;

select ccbc_public.create_user_from_session();

select results_eq (
  $$
    select given_name, family_name, email_address, session_sub
    from ccbc_public.ccbc_user
    where session_sub = '11111111-1111-1111-1111-111111111111'
  $$,
  $$
  values (
    'Bob'::varchar(1000),
    'Loblaw'::varchar(1000),
    'bob.loblaw@gov.bc.ca'::varchar(1000),
    '11111111-1111-1111-1111-111111111111'::varchar(1000)
  )
  $$,
  'create_user_from_session() successfully creates a user'
);

select function_privs_are(
  'ccbc_public', 'create_user_from_session', ARRAY[]::text[], 'ccbc_analyst', ARRAY['EXECUTE'],
  'ccbc_analyst can execute ccbc_public.create_user_from_session()'
);

select function_privs_are(
  'ccbc_public', 'create_user_from_session', ARRAY[]::text[], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.create_user_from_session()'
);

select finish();
rollback;
