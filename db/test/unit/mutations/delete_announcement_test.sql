begin;

select plan(9);

truncate table
  ccbc_public.application,
  ccbc_public.announcement,
  ccbc_public.ccbc_user,
  ccbc_public.intake
restart identity cascade;

select has_function('ccbc_public', 'delete_announcement',
'Function delete_announcement should exist');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1),
      ('2022-05-01 09:00:01-07', '2022-06-01 09:00:00-07', 2);
select mocks.set_mocked_time_in_transaction((select open_timestamp from ccbc_public.intake limit 1));

-- Test users
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111111'),
  ('foo2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111112');
  

set role ccbc_auth_user;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

insert into ccbc_public.application
  (id, ccbc_number, owner) overriding system value
   values
  (1,'CCBC-010001', '11111111-1111-1111-1111-111111111112');

insert into ccbc_public.application
  (id, ccbc_number, owner) overriding system value
   values
  (2,'CCBC-010002', '11111111-1111-1111-1111-111111111112');

-- set two applications to received
insert into ccbc_public.application_status
 (application_id, status) values (1,'received'), (2, 'received');
 
-- set role to analyst and create announcement 
set role ccbc_analyst;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select ccbc_public.create_announcement('CCBC-010001','{"announcementType":"Primary"}'::jsonb);

select results_eq(
  $$
    select count(*) from ccbc_public.announcement;
  $$,
  $$
    values(1::bigint);
  $$,
  'Should see announcement record in announcement table'
);

select results_eq(
  $$
    select count(*) from ccbc_public.application_announcement where application_id = 1;
  $$,
  $$
    values(1::bigint);
  $$,
  'Should see new record in application_announcement table for application 1'
);

select lives_ok(
  $$
    select ccbc_public.delete_announcement(1, -1);
  $$,
  'Delete announcement for all applications'
);

select results_eq(
  $$
    select count(*) from ccbc_public.announcement where archived_at is null;
  $$,
  $$
    values(0::bigint);
  $$,
  'Should see no announcement records in announcement table after delete'
);

select results_eq(
  $$
    select count(*) from ccbc_public.announcement where archived_at is not null;
  $$,
  $$
    values(1::bigint);
  $$,
  'Should see an archived records in announcement table after delete'
);

select results_eq(
  $$
    select count(*) from ccbc_public.application_announcement where application_id = 1 and archived_at is null;
  $$,
  $$
    values(0::bigint);
  $$,
  'Should not see any record in application_announcement table for application 1 after delete'
);

-- test selective delete
select ccbc_public.create_announcement('CCBC-010001,CCBC-010002','{"announcementType":"Secondary"}'::jsonb);

select ccbc_public.delete_announcement(2, 1);

select results_eq(
  $$
    select count(*) from ccbc_public.application_announcement where application_id = 1 and announcement_id = 2 and archived_at is null;
  $$,
  $$
    values(0::bigint);
  $$,
  'Should not see any record in application_announcement table for application 1 after delete announcement 2'
);

select results_eq(
  $$
    select count(*) from ccbc_public.application_announcement where application_id = 2 and announcement_id = 2 and archived_at is null;
  $$,
  $$
    values(1::bigint);
  $$,
  'Should still see a record in application_announcement table for application 2 after delete announcement 2'
);

select finish();
rollback;
