begin;

select plan(11);

select has_function('ccbc_public', 'session', 'function ccbc_public.session exists');

select is(
  (select sub from ccbc_public.session()),
  NULL,
  'The session function should return null if jwt.claims.sub is null'
);

set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';
select is(
  (select sub from ccbc_public.session()),
  '11111111-1111-1111-1111-111111111111'::varchar,
  'The session sub is determined by the jwt.claims.sub setting'
);

set jwt.claims.jti to '22222222-2222-2222-2222-222222222222';
set jwt.claims.session_state to '33333333-3333-3333-3333-333333333333';
select is(
  (select jti from ccbc_public.session()),
  '22222222-2222-2222-2222-222222222222'::uuid,
  'A valid uuid jti claim is preserved'
);
select is(
  (select session_state from ccbc_public.session()),
  '33333333-3333-3333-3333-333333333333'::uuid,
  'A valid uuid session_state claim is preserved'
);

set jwt.claims.jti to 'Mfoau_WkVd9ZOvXtK_Onizbh';
set jwt.claims.session_state to 'Mfoau_WkVd9ZOvXtK_Onizbh';
select is(
  (select jti from ccbc_public.session()),
  NULL,
  'A non-uuid jti claim is nulled instead of raising a cast error'
);
select is(
  (select session_state from ccbc_public.session()),
  NULL,
  'A non-uuid session_state claim is nulled instead of raising a cast error'
);

select function_privs_are(
  'ccbc_public', 'session', ARRAY[]::text[], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.session()'
);
select function_privs_are(
  'ccbc_public', 'session', ARRAY[]::text[], 'ccbc_guest', ARRAY['EXECUTE'],
  'ccbc_guest can execute ccbc_public.session()'
);

select function_privs_are(
  'ccbc_public', 'session', ARRAY[]::text[], 'ccbc_admin', ARRAY['EXECUTE'],
  'ccbc_admin can execute ccbc_public.session()'
);

select function_privs_are(
  'ccbc_public', 'session', ARRAY[]::text[], 'ccbc_analyst', ARRAY['EXECUTE'],
  'ccbc_analyst can execute ccbc_public.session()'
);

select finish();

rollback;
