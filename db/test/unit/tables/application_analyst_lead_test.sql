begin;
select plan(16);

select has_table('ccbc_public', 'application_analyst_lead', 'table ccbc_public.application_analyst_lead exists');
select has_column('ccbc_public', 'application_analyst_lead', 'id', 'table ccbc_public.application_analyst_lead has id column');
select has_column('ccbc_public', 'application_analyst_lead', 'application_id', 'table ccbc_public.application_analyst_lead has application_id column');
select has_column('ccbc_public', 'application_analyst_lead', 'analyst_id', 'table ccbc_public.application_analyst_lead has analyst_id column');

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);

insert into
  ccbc_public.intake(id, open_timestamp, close_timestamp, ccbc_intake_number)
overriding system value
values
  (1, '2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

delete from ccbc_public.ccbc_user;

-- ccbc_guest
set role ccbc_guest;

select throws_like(
  $$
    select * from ccbc_public.application_analyst_lead
  $$,
  'permission denied%',
  'ccbc_guest cannot select'
);

select throws_like(
  $$
    insert into ccbc_public.application_analyst_lead (application_id, analyst_id) values (1, 1);
  $$,
  'permission denied%',
  'ccbc_guest cannot insert'
);

select throws_like(
  $$
    delete from ccbc_public.application_analyst_lead where id=1
  $$,
  'permission denied%',
    'ccbc_guest cannot delete rows from table_analyst'
);

-- ccbc_auth_user
set role ccbc_auth_user;
set jwt.claims.sub to 'testCcbcAuthUser';

insert into ccbc_public.ccbc_user
  (id, given_name, family_name, email_address, session_sub) overriding system value values
  (1, 'foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

-- select ccbc_public.create_application();

insert into ccbc_public.application
  (id, ccbc_number, owner, intake_id) overriding system value
   values
  (1,'CCBC-010001', 'testCcbcAuthUser', 1);

select throws_like(
  $$
    select * from ccbc_public.application_analyst_lead
  $$,
  'permission denied%',
  'ccbc_auth_user cannot select'
);

select throws_like(
  $$
    insert into ccbc_public.application_analyst_lead (application_id, analyst_id) values (1, 1);
  $$,
  'permission denied%',
  'ccbc_auth_user cannot insert'
);

select throws_like(
  $$
    delete from ccbc_public.application_analyst_lead where id=1
  $$,
  'permission denied%',
    'ccbc_auth_user cannot delete rows from table_analyst'
);

reset role;

-- ccbc_admin
set role ccbc_admin;

set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111111');
 
insert into ccbc_public.application_analyst_lead
  (application_id, analyst_id) overriding system value
  values
  (1, 1),
  (1, 2);


select results_eq(
  $$
    select count(*) status from ccbc_public.application_analyst_lead;
  $$,
  $$
    values (2::bigint)
  $$,
  'ccbc_admin can select'
);


select throws_like(
  $$
    delete from ccbc_public.application_analyst_lead where id=1
  $$,
  'permission denied%',
    'ccbc_admin cannot delete rows from table_analyst'
);

select throws_like(
  $$
    update ccbc_public.application_analyst_lead
    set application_id = 2
    where id=1
  $$,
  'permission denied%',
    'ccbc_admin cannot update'
);


reset role;


-- ccbc_analyst
set role ccbc_analyst;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';


select results_eq(
  $$
    select count(*) status from ccbc_public.application_analyst_lead;
  $$,
  $$
    values (2::bigint)
  $$,
  'ccbc_analyst can select'
);

select throws_like(
  $$
    delete from ccbc_public.application_analyst_lead where id=1
  $$,
  'permission denied%',
    'ccbc_analyst cannot delete rows from table_analyst'
);

select throws_like(
  $$
    update ccbc_public.application_analyst_lead
    set application_id = 2
    where id=1
  $$,
  'permission denied%',
    'ccbc_analyst cannot update'
);

select finish();
rollback;
