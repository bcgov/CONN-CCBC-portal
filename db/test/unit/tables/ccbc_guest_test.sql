begin;
select plan(4);

-- ccbc_guest
set role ccbc_guest;
select concat('current user is: ', (select current_user));

select throws_like(
  $$
    update ccbc_public.ccbc_user set session_sub = 'ca716545-a8d3-4034-819c-5e45b0e775c9' where session_sub!=(select sub from ccbc_public.session())
  $$,
  'permission denied%',
    'ccbc_guest cannot update their session_sub'
);

select throws_like(
  $$
    insert into ccbc_public.ccbc_user (session_sub, given_name, family_name) values ('21111111-1111-1111-1111-111111111111'::VARCHAR, 'test', 'testerson');
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

select throws_like(
  $$
    select * from ccbc_public.applications
  $$,
  'permission denied%',
    'ccbc_guest cannot select rows from table_applications'
);

select finish();
rollback;
