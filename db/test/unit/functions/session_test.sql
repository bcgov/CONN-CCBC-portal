begin;

select plan(4);

select has_function('ccbc_public', 'session', 'function ccbc_public.session exists');

select is((select sub from ccbc_public.session()), NULL, 'The session function should return null if jwt.claims.sub and jwt.claims.idir_userid are both null');

set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';
select is((select sub from ccbc_public.session()), '11111111-1111-1111-1111-111111111111'::varchar, 'The session sub is determined by the jwt.claims.sub setting if the jwt.claims.idir_userid setting is not set');

select finish();

rollback;
