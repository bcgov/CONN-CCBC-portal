begin;
select plan(13);

truncate table
  ccbc_public.application,
  ccbc_public.announcement,
  ccbc_public.ccbc_user,
  ccbc_public.intake
restart identity cascade;

select has_table('ccbc_public', 'announcement', 'table ccbc_public.announcement exists');
select has_column('ccbc_public', 'announcement', 'id', 'table ccbc_public.announcement has id column');
select has_column('ccbc_public', 'announcement', 'ccbc_numbers', 'table ccbc_public.announcement has ccbc_numbers  column');
select has_column('ccbc_public', 'announcement', 'json_data', 'table ccbc_public.announcement has json_data column');

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


-- ccbc_guest
set role ccbc_auth_user;

select throws_like(
  $$
    select * from ccbc_public.announcement
  $$,
  'permission denied%',
  'ccbc_guest cannot select'
);

select throws_like(
  $$
    insert into ccbc_public.announcement (id, ccbc_numbers, json_data) overriding system value
    values (1, 'CCBC-010001', '{}'::jsonb);
  $$,
  'permission denied%',
  'ccbc_guest cannot insert'
);

select throws_like(
  $$
    delete from ccbc_public.announcement where id=1
  $$,
  'permission denied%',
    'ccbc_guest cannot delete rows from ccbc_public.announcement'
);

-- ccbc_admin
set role ccbc_admin;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select lives_ok(
  $$
    insert into ccbc_public.announcement (id, ccbc_numbers, json_data) overriding system value
    values (1, 'CCBC-010001', '{}'::jsonb);
  $$,
  'ccbc_admin can insert'
);

select throws_like(
  $$
    delete from ccbc_public.announcement where id=1
  $$,
  'permission denied%',
    'ccbc_admin cannot delete rows from table_analyst'
);

select lives_ok(
  $$
    update ccbc_public.announcement
    set ccbc_numbers = 'CCBC-010001,CCBC-010002'
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
    insert into ccbc_public.announcement (id, ccbc_numbers, json_data)  overriding system value
    values (2, 'CCBC-010002', '{}'::jsonb);
  $$,
  'ccbc_analyst can insert'
);

select throws_like(
  $$
    delete from ccbc_public.announcement where id=2
  $$,
  'permission denied%',
    'ccbc_analyst cannot delete rows from table_analyst'
);

select lives_ok(
  $$
    update ccbc_public.announcement
    set ccbc_numbers = 'CCBC-010002,CCBC-010002'
    where id=2
  $$,
    'ccbc_analyst can update'
);

select finish();
rollback;
