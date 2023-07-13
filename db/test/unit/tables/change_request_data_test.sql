begin;
select plan(8);

select has_table('ccbc_public', 'change_request_data', 'table ccbc_public.change_request_data exists');
select has_column('ccbc_public', 'change_request_data', 'id', 'table ccbc_public.change_request_data has id column');
select has_column('ccbc_public', 'change_request_data', 'amendment_number', 'table ccbc_public.change_request_data has amendment_number column');
select has_column('ccbc_public', 'change_request_data', 'json_data', 'table ccbc_public.change_request_data has json_data column');

-- ccbc_guest
set role ccbc_guest;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select throws_like(
  $$
    select application_id from ccbc_public.change_request_data
  $$,
  'permission denied%',
  'ccbc_guest cannot select'
);

-- ccbc_auth_user
set role ccbc_auth_user;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select throws_like(
  $$
    select application_id from ccbc_public.change_request_data
  $$,
  'permission denied%',
  'ccbc_auth_user cannot select'
);

-- ccbc_admin
set role ccbc_admin;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select results_eq(
  $$
    select count(*) from ccbc_public.change_request_data;
  $$,
  $$
    values (0::bigint)
  $$,
  'ccbc_admin can select'
);

-- ccbc_analyst
set role ccbc_analyst;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select results_eq(
  $$
    select count(*) from ccbc_public.change_request_data;
  $$,
  $$
    values (0::bigint)
  $$,
  'ccbc_analyst can select'
);
select finish();
rollback;
