begin;

select plan(9);

truncate table
  ccbc_public.application,
  ccbc_public.announcement,
  ccbc_public.ccbc_user,
  ccbc_public.intake
restart identity cascade;

select has_function('ccbc_public', 'create_announcement',
'Function create_announcement should exist');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1),
      ('2022-05-01 09:00:01-07', '2022-06-01 09:00:00-07', 2);
select mocks.set_mocked_time_in_transaction((select open_timestamp from ccbc_public.intake limit 1));

-- Test users
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111111'),
  ('foo2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111112'),
  ('foo3', 'bar', 'foo3@bar.com', '11111111-1111-1111-1111-111111111113');
  

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

select results_eq(
  $$
    select is_primary from ccbc_public.application_announcement where application_id = 1;
  $$,
  $$
    values('t'::bool);
  $$,
  'New record in application_announcement table should be marked as primary'
);

select results_eq(
  $$
    select count(*) from ccbc_public.announcement where archived_at is not null;
  $$,
  $$
    values(0::bigint);
  $$,
  'Should not be any archived records in announcement table'
);

-- update announcement with same project numbers
select ccbc_public.update_announcement('CCBC-010001,CCBC-010002,CCBC-010001','{"announcementType":"Secondary"}'::jsonb, 1);

select results_eq(
  $$
    select count(*) from ccbc_public.announcement where archived_at is not null;
  $$,
  $$
    values(1::bigint);
  $$,
  'Updated application should archive prevous record in announcement table'
);

select results_eq(
  $$
    select count(*) from ccbc_public.announcement where archived_at is null;
  $$,
  $$
    values(1::bigint);
  $$,
  'Updated application should have archived_at = null in announcement table'
);

select results_eq(
  $$
    select count(*) from ccbc_public.application_announcement where archived_at is not null and application_id=1;
  $$,
  $$
    values(1::bigint);
  $$,
  'Only one record should be added if same ccbc number submitted twice'
);

select results_eq(
  $$
    select is_primary from ccbc_public.application_announcement where application_id = 2;
  $$,
  $$
    values('f'::bool);
  $$,
  'New record in application_announcement table should be marked as secondary'
);


select finish();
rollback;
