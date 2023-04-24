begin;

select plan(17);

-- Table exists
select has_table(
  'ccbc_public', 'application_gis_assessment_hh',
  'ccbc_public.application_gis_assessment_hh should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'application_gis_assessment_hh', 'id','The table attachment has column id');
select has_column('ccbc_public', 'application_gis_assessment_hh', 'application_id','The table attachment has column application_id');
select has_column('ccbc_public', 'application_gis_assessment_hh', 'eligible','The table attachment has column eligible');
select has_column('ccbc_public', 'application_gis_assessment_hh', 'eligible_indigenous','The table attachment has column eligible_indigenous');
-- Privileges
select table_privs_are(
  'ccbc_public', 'application_gis_assessment_hh', 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest has no privileges on application_gis_assessment_hh table'
);

select table_privs_are(
  'ccbc_public', 'application_gis_assessment_hh', 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user has no privileges on application_gis_assessment_hh table'
);

select table_privs_are(
  'ccbc_public', 'application_gis_assessment_hh', 'ccbc_analyst', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_analyst has privileges from application_gis_assessment_hh table'
);

select table_privs_are(
  'ccbc_public', 'application_gis_assessment_hh', 'ccbc_admin', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_admin has privileges from application_gis_assessment_hh table'
);

-- Test setup

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);
set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo2', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111111');

set role ccbc_auth_user;

select ccbc_public.create_application();


-- ccbc_auth_user
set role ccbc_auth_user;

select throws_like(
  $$
    select * from ccbc_public.application_gis_assessment_hh
  $$,
  'permission denied%',
  'ccbc_guest cannot select'
);

select throws_like(
  $$
    insert into ccbc_public.application_gis_assessment_hh (application_id, eligible) overriding system value
    values (1, 10);
  $$,
  'permission denied%',
  'ccbc_auth_user cannot insert'
);


-- ccbc_admin
set role ccbc_admin;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select lives_ok(
  $$
    insert into ccbc_public.application_gis_assessment_hh (application_id, eligible) overriding system value
    values (1, 10);
  $$,
  'ccbc_admin can insert'
);

select throws_like(
  $$
    delete from ccbc_public.application_gis_assessment_hh where id=1
  $$,
  'permission denied%',
    'ccbc_admin cannot delete rows from table_analyst'
);

select lives_ok(
  $$
    update ccbc_public.application_gis_assessment_hh
    set eligible = 20
    where id=1
  $$,
  'ccbc_admin can update'
);


reset role;


-- ccbc_analyst
set role ccbc_analyst;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select lives_ok(
  $$
    insert into ccbc_public.application_gis_assessment_hh (application_id, eligible) overriding system value
    values (1, 10);
  $$,
  'ccbc_analyst can insert'
);

select throws_like(
  $$
    delete from ccbc_public.application_gis_assessment_hh where id=1
  $$,
  'permission denied%',
    'ccbc_analyst cannot delete rows from table_analyst'
);

select lives_ok(
  $$
    update ccbc_public.application_gis_assessment_hh
    set eligible = 20
    where id=1
  $$,
    'ccbc_analyst can update'
);

select finish();
rollback;
