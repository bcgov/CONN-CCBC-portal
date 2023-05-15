begin;
select plan(13);

truncate table
  ccbc_public.application,
  ccbc_public.announcement,
  ccbc_public.ccbc_user,
  ccbc_public.intake
restart identity cascade;


insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1),
      ('2022-05-01 09:00:01-07', '2022-06-01 09:00:00-07', 2);
select mocks.set_mocked_time_in_transaction((select open_timestamp from ccbc_public.intake limit 1));


-- Table exists
select has_table(
  'ccbc_public', 'application_announcement',
  'ccbc_public.application_announcement should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'application_announcement', 'announcement_id','The table application has column announcement_id');
select has_column('ccbc_public', 'application_announcement', 'application_id','The table application has column application_id');
select has_column('ccbc_public', 'application_announcement', 'is_primary','The table application has column is_primary');
select has_column('ccbc_public', 'application_announcement', 'history_operation','The table application has column history_operation');

-- Row level security tests --

-- Test users
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111111'),
  ('foo2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111112'),
  ('foo3', 'bar', 'foo3@bar.com', '11111111-1111-1111-1111-111111111113');


-- Test data setup
set role ccbc_auth_user;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

insert into ccbc_public.application
  (id, ccbc_number, owner) overriding system value
   values
  (1,'CCBC-010001', '11111111-1111-1111-1111-111111111112');

-- ccbc_admin
set role ccbc_admin;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

insert into ccbc_public.announcement (id, ccbc_numbers, json_data) overriding system value
    values (1, 'CCBC-010001', '{}'::jsonb);

-- ccbc_guest
set role ccbc_guest;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

select throws_like(
  $$
    select * from ccbc_public.application_announcement
  $$,
  'permission denied%',
  'ccbc_guest cannot select'
);

select throws_like(
  $$
    insert into ccbc_public.application_announcement ( announcement_id, application_id) overriding system value
    values (1, 1);
  $$,
  'permission denied%',
  'ccbc_guest cannot insert'
);

select throws_like(
  $$
    delete from ccbc_public.application_announcement where announcement_id=1
  $$,
  'permission denied%',
    'ccbc_guest cannot delete rows from ccbc_public.application_announcement'
);

-- cbc_auth_user
set role ccbc_auth_user;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111113';

select throws_like(
  $$
    select * from ccbc_public.application_announcement
  $$,
  'permission denied%',
  'ccbc_auth_user cannot select'
);

select throws_like(
  $$
    insert into ccbc_public.application_announcement ( announcement_id, application_id) overriding system value
    values (1, 1);
  $$,
  'permission denied%',
  'ccbc_auth_user cannot insert'
);

select throws_like(
  $$
    delete from ccbc_public.application_announcement where announcement_id=1
  $$,
  'permission denied%',
    'ccbc_auth_user cannot delete rows from ccbc_public.application_announcement'
);

-- ccbc_admin
set role ccbc_admin;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select lives_ok(
  $$
    insert into ccbc_public.application_announcement ( announcement_id, application_id) overriding system value
    values (1, 1);
  $$,
  'ccbc_admin can insert'
);

select throws_like(
  $$
    delete from ccbc_public.application_announcement where announcement_id=1
  $$,
  'permission denied%',
    'ccbc_admin cannot delete rows from application_announcement'
);


select finish();
rollback;
