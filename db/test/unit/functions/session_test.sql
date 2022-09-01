begin;

select plan(5);

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

select function_privs_are(
  'ccbc_public', 'session', ARRAY[]::text[], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.session()'
);
select function_privs_are(
  'ccbc_public', 'session', ARRAY[]::text[], 'ccbc_guest', ARRAY['EXECUTE'],
  'ccbc_guest can execute ccbc_public.session()'
);

select finish();

rollback;
