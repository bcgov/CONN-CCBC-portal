begin;

select plan(6);

truncate table
  ccbc_public.application,
  ccbc_public.intake,
  ccbc_public.ccbc_user
restart identity cascade;

-- Test setup
insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);

set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111112');

insert into ccbc_public.application
  (id, ccbc_number, owner) overriding system value
   values
  (1,'CCBC-010001', '11111111-1111-1111-1111-111111111112');


set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

create table ccbc_public.test_table_all (
  id integer primary key generated always as identity,
  application_id integer,
  test_name varchar(1000),
  created_at timestamp with time zone not null default now(),
  created_by int references ccbc_public.ccbc_user,
  updated_at timestamp with time zone not null default now(),
  updated_by int references ccbc_public.ccbc_user,
  archived_at timestamp with time zone,
  archived_by int references ccbc_public.ccbc_user
);

grant select, update on ccbc_public.test_table_all to ccbc_archiver;

create table ccbc_public.test_table_no_app_id (
  id integer primary key generated always as identity,
  test_name varchar(1000)
);

grant select, update on ccbc_public.test_table_no_app_id to ccbc_archiver;

select ccbc_private.upsert_timestamp_columns(
  table_schema_name => 'ccbc_public',
  table_name => 'test_table_all');


select ccbc_private.upsert_timestamp_columns(
  table_schema_name => 'ccbc_public',
  table_name => 'test_table_no_app_id');

select ccbc_private.upsert_archive_trigger(
  table_schema_name => 'ccbc_public',
  table_name => 'test_table_all');


select ccbc_private.upsert_archive_trigger(
  table_schema_name => 'ccbc_public',
  table_name => 'test_table_no_app_id');

select has_function(
  'ccbc_private', 'set_archived',
  'Function set_archived should exist'
);

-- Add first record
insert into ccbc_public.test_table_all (test_name, application_id) values ('first', 1);

select is (
  (select archived_by from ccbc_public.test_table_all where id=1),
  null,
  'trigger does not set archived_at on insert'
);

-- Add second record for same application
insert into ccbc_public.test_table_all (test_name, application_id) values ('second', 1);
select is (
  (select archived_by from ccbc_public.test_table_all where id=1),
  (select id from ccbc_public.ccbc_user where session_sub='11111111-1111-1111-1111-111111111112'),
  'trigger sets archived_at on insert of next record for same application'
);
select is (
  (select archived_by from ccbc_public.test_table_all where id=2),
  null,
  'trigger does not set archived_at on insert'
);

-- Trigger does not error on insert when no created_at/by columns exist
select lives_ok(
  $$ insert into ccbc_public.test_table_no_app_id(test_name) values('create_only') $$,
  'table can insert without error when no application_id columns exist'
);

-- Trigger does not error on update when no updated_at/by columns exist
select lives_ok(
  $$ update ccbc_public.test_table_no_app_id set test_name='updated' $$,
  'table can update without error when no application_id columns exist'
);

select * from finish();

rollback;
